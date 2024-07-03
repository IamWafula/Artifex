require('dotenv').config();


const express = require('express');
const routes = express.Router()
const {app, generatedImages} = require("../utils/firebase_config")

const {PrismaClient, Prisma}= require('@prisma/client');
const prisma = new PrismaClient();

const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } =  require("firebase/auth");
const { uploadBytes, ref, getDownloadURL } = require('firebase/storage');

const { NotFoundError, ExistingUserError, NoUserFound  } = require('../middleware/CustomErrors');

/*
    Function to add new image to prisma database
*/
async function addNewImage(image_id, image_url, image_prompt, user_id){
    // add logic to add to firebase

    const newImageFirebase = ref(generatedImages, image_id)
    const responseBlob = await fetch(image_url, { method: 'get', mode: 'no-cors', referrerPolicy: 'no-referrer' })

    if (responseBlob.status == 200){
        const blob = await responseBlob.blob()

        const metadata = {
            contentType : 'image/jpeg'
        }

        const snapshot = await uploadBytes(newImageFirebase, blob, metadata)
        const downloadUrl = await getDownloadURL(newImageFirebase, blob, metadata)

        const newImage = await prisma.image.create({
            data: {
                id : image_id,
                imgUrl: downloadUrl,
                userId: user_id,
                prompt: image_prompt
            }
        })

        return newImage

    // error handling here
    }


}

// route used to test Firebase uploads
routes.post('/upload-firebase/', async (req, res, next) => {
    return next(new NotFoundError)

    const { imageUrl, imageId } = req.body;

    const newImageFirebase = ref(generatedImages, imageId)
    const response = await fetch(imageUrl, { method: 'get', mode: 'no-cors', referrerPolicy: 'no-referrer' })

    if (response.status == 200){
        const blob = await response.blob()

        const metadata = {
            contentType : 'image/jpeg'
        }

        const snapshot = await uploadBytes(newImageFirebase, blob, metadata)
        console.log(snapshot)
        const downloadUrl = await getDownloadURL(newImageFirebase, blob, metadata)
        console.log(downloadUrl)
        res.json({"response" : "success"})
    } else {
        res.json({"response" : "image not found"})
    }

})


/*
    Function to check how long to wait for the image to finish generating from AI Horde
*/
async function getImageWaitTime(image_id){
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "apikey": process.env.HORDE_API_KEY
        }
    }

    const url = `https://stablehorde.net/api/v2/generate/status/${image_id}`

    const response = await fetch(url , options);


    if (response.status == 200){
        const resJson = await response.json();
        return resJson.wait_time

    }

    return null
}

async function addImage(image_id, prompt, user_id){
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "apikey": process.env.HORDE_API_KEY
        }
    }

    const url = `https://stablehorde.net/api/v2/generate/status/${image_id}`

    const response = await fetch(url , options);
    if (response.status == 200){

        const resJson = await response.json();

        if (resJson.generations.length > 0){

            // add a new image if its done cooking
            try {

                const new_image = await addNewImage(image_id, resJson.generations[0].img, prompt, user_id)
                console.log("just right")
                return (new_image)

            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("called too early")

            setTimeout(()=> {
                return (addImage(image_id, prompt, user_id))
            }, 3000)
        }

    }
}


async function getImageUrl(image_id){
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "apikey": process.env.HORDE_API_KEY
        }
    }

    try{
        // error here when trying to re-add image
        const image = await prisma.image.findUnique({
            where : { id: image_id }
        })

        if (image) {
            return image
        } else {
            // if the image was still cooking
            const url = `https://stablehorde.net/api/v2/generate/status/${image_id}`

            const response = await fetch(url , options);

            if (response.status == 200){
                const resJson = await response.json();
                return resJson
            } else{
                return {"response" : "Image not avaiable"}
            }

        }
    } catch (error) {
        console.log(error)
    }

    return null
}


routes.get('/:image_id', async (req, res) => {
    const image_id = req.params.image_id;

    const data = await getImageUrl(image_id, null, null);
    if (!data) { return res.json({"response" : "Image not available"}) }
    if (data) { return res.json( data ) }

    return res.json({"response" : "Image not reeady"})

})

routes.post('/', async (req, res) => {
    const { prompt, userId } = req.body;

    // replace with meaningful error
    if (!prompt) { return res.json({"response" : "no image prompts specified"}) }

    const prompt_options = {
        "prompt" : prompt,
        "nsfw" : false
    }

    let options = {
        method: "POST",
        headers: {
            'accept': 'application/json',
            "Content-Type": "application/json",
            "apikey": `${process.env.HORDE_API_KEY}`
        },
        body: JSON.stringify(prompt_options)
    }

    const url = "https://stablehorde.net/api/v2/generate/async"

    const response = await fetch(url , options)

    const postTimeout = (waitTime, id, image_prompt, userId) => {

        // wait for image to finish generating, could routine to send email and add to Prisma Schema
        // should definitely add safeguard for when timeout is off by a few seconds
        setTimeout(async ()=> {
            const imageUrl = await addImage(id, image_prompt, userId);
            console.log("newimage url", imageUrl)
        }, parseInt((waitTime)*1000)) // time in milliseconds

        const response = {
            "id": id,
            "wait_time" : waitTime
        }

        return res.json(response)
    }

    // check if Image is being generated
    if (response.status == 202){
        const resJson = await response.json()
        const imageId = resJson["id"]

        let waitTime = await getImageWaitTime(imageId)

        // slight error when image has just been uploaded for generation, where wait time is 0
        // set timeout to 2 seconds since 1s still didnt work
        function reTryWaitTime (wait_time, backoff) {
            if (wait_time === 0) {
                setTimeout(async ()=> {
                    wait_time = await getImageWaitTime(imageId)
                    console.log(`Waiting time after ${backoff}`, wait_time)
                    return reTryWaitTime(wait_time, backoff+1)
                    // // since repeating same operations twice, moved to function instead
                    // return postTimeout(wait_time, imageId)
                }, 1000*backoff)

            } else {
                console.log("Called post timeout")
                // call function that execute once we have a definite time to wait
                return postTimeout(wait_time, imageId, prompt, userId)
            }
        }

        return reTryWaitTime(waitTime, 1)

    } else {
        return res.json({"response" : "Something went wrong"})
    }

})

module.exports = routes;
