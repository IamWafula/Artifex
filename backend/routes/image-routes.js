require('dotenv').config();


const express = require('express');
const routes = express.Router()
const {app, generatedImages} = require("../utils/firebase_config")

const {PrismaClient, Prisma}= require('@prisma/client');
const prisma = new PrismaClient();

const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } =  require("firebase/auth");
const { uploadBytes, ref, getDownloadURL } = require('firebase/storage');

const { NotFoundError, ExistingUserError, NoUserFound  } = require('../middleware/CustomErrors');

async function getAllUserImages(user_id){

    const images = await prisma.image.findMany({
        where: {
            userId : user_id
        }
    })

    return images

}


routes.get('/:user_id', async (req, res, next) => {

    const userId = req.params.user_id;

    const all_images = await getAllUserImages(userId);

    return res.json(all_images)

})


module.exports = routes;
