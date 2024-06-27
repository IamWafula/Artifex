require('dotenv').config();


const express = require('express');
const routes = express.Router()

routes.get('/:image_id', async (req, res) => {
    const image_id = req.params.image_id;

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
        const resJson = await response.json()

        return res.json(resJson)
    }

    return res.json({"response" : "Something went wrong"})

})

routes.post('/', async (req, res) => {
    const prompt = req.body.prompt;

    // replace with meaningful error
    if (!prompt) { return res.json({"response" : "no image promps specified"}) }

    const prompt_options = {
        "prompt" : prompt,
        "nsfw" : false
    }

    const options = {
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
    if (response.status == 202){
        const resJson = await response.json()
        console.log(resJson)

        return res.json(resJson)
    }
    return res.json({"response" : "Something went wrong"})

})

module.exports = routes;
