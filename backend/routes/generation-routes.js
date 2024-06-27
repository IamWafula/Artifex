require('dotenv').config();


const express = require('express');
const routes = express.Router()
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

async function getImageUrl(image_id){
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "apikey": process.env.HORDE_API_KEY
        }
    }

    const url = `https://stablehorde.net/api/v2/generate/status/${image_id}`

    const response = await fetch(url , options);

    switch (response.status){
        case (200) :

    }

    if (response.status == 200){
        const resJson = await response.json();

        if (resJson.generations.length > 0){
            return resJson.generations[0].img
        }

    } else{
        console.log(response)
    }

    return null
}

routes.get('/:image_id', async (req, res) => {
    const image_id = req.params.image_id;

    const url = await getImageUrl(image_id);

    if (url) { return url }

    return res.json({"response" : "Image not ready"})

})

routes.post('/', async (req, res) => {
    const prompt = req.body.prompt;

    // replace with meaningful error
    if (!prompt) { return res.json({"response" : "no image promps specified"}) }

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

    const postTimeout = (waitTime, id) => {
        // wait for image to finish generating, could routine to send email and add to Prisma Schema
        setTimeout(async ()=> {
            const imageUrl = await getImageUrl(id);
            console.log("IMAGE URL", imageUrl)
        }, parseInt(waitTime*1000))

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
            if (wait_time == 0) {
                setTimeout(async ()=> {
                    wait_time = await getImageWaitTime(imageId)
                    console.log(`Waiting time after ${backoff}`, wait_time)
                    return reTryWaitTime(waitTime, backoff+1)
                    // // since repeating same operations twice, moved to function instead
                    // return postTimeout(wait_time, imageId)
                }, 1000*backoff)

            } else {
                return postTimeout(wait_time, imageId)
            }
        }

        return reTryWaitTime(waitTime, 1)

    } else {
        return res.json({"response" : "Something went wrong"})
    }

})

module.exports = routes;
