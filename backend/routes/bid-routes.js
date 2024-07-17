require('dotenv').config();


const express = require('express');
const routes = express.Router()
const {app, generatedImages} = require("../utils/firebase_config")

const {PrismaClient, Prisma}= require('@prisma/client');
const prisma = new PrismaClient();

const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } =  require("firebase/auth");
const { uploadBytes, ref, getDownloadURL } = require('firebase/storage');

const { NotFoundError, ExistingUserError, NoUserFound  } = require('../middleware/CustomErrors');


routes.post( "/", async (req, res, next) => {
    const {fullBid, description, postId, userId} = req.body;

    const newBid = await prisma.bid.create({
        data: {
            userId,
            description,
            postId: parseInt(postId)
        }
    })

    for (let port_num in fullBid){
        const images = []
        for (let image_id in fullBid[port_num]) {
            images.push(fullBid[port_num][image_id])
        }

        const portfolio = await prisma.portfolio.create({
            data : {
                portfolioNumber : parseInt(port_num),
                image : {
                    create : images
                },
                bidId : parseInt(newBid.id)
            }
        })
    }

    res.json({"response" : "success"})
})

module.exports = routes;