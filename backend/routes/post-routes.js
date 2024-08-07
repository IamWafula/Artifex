require('dotenv').config();


const express = require('express');
const routes = express.Router()
const {app, generatedImages} = require("../utils/firebase_config")

const {PrismaClient, Prisma}= require('@prisma/client');
const prisma = new PrismaClient();

const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } =  require("firebase/auth");
const { uploadBytes, ref, getDownloadURL } = require('firebase/storage');

const { NotFoundError, ExistingUserError, NoUserFound  } = require('../middleware/CustomErrors');


routes.post("/", async (req, res) =>{
    const {images, title, description, category} = req.body;
    try{
        const new_post = await prisma.post.create({
            data : {
                title,
                description,
                category,
                userId: images[0].userId
            }
        })

        for (let idx in images){
            const image = images[idx]
            let annotations = []

            for (let idx_ann in image.notes){
                let ann_data = {
                    text: image.notes[idx_ann][2],
                    positionX : image.notes[idx_ann][0],
                    positionY : image.notes[idx_ann][1],
                    imageId : image.id,
                    userId : image.userId,
                    postId : new_post.id
                }

                annotations = [...annotations, ann_data]
            }

            const annT = await prisma.annotation.createManyAndReturn({
                data : annotations
            })

            await prisma.image.update({
                where: {
                    id : image.id
                },
                data: {
                    postId: new_post.id
                }
            })
        }


    } catch(error){
        console.log(error)
        res.json({"response" : "something went wrong"})
    }



    res.json({"response" : "success"})
})

routes.get("/:id" , async (req, res) => {
    try
    {
        const id = parseInt(req.params.id);

        const post = await prisma.post.findUnique({
            where : {
                id: id
            },
            include: {
                images: {
                    include : {
                        annotations : true
                    }
                },
                user: true,
                bids: {
                    include : {
                        portfolioItems : {
                            include : {
                                image : true
                            }
                        }
                    }
                },
                likes: true
            }
        })
        return res.json(post)
    } catch (error) {
        console.log(error)
        res.json({"response" : "something went wrong"})
    }
})

routes.delete("/:id", async (req, res) => {
    const postId = parseInt(req.params.id);

    const deletedPost = await prisma.post.delete({
        where : {
            id: postId
        }
    })

    return res.json(deletedPost)

})

routes.get("/user/:id", async (req, res) => {
    const userId = req.params.id
    const allUserPosts = await prisma.post.findMany({
        where: {
            userId : userId
        },
        include: {
            images: true,
            user: true,
            bids: true,
            likes: true
        }
    })

    return res.json(allUserPosts)
})

routes.get("/", async (req, res) => {
    const allPosts = await prisma.post.findMany({
        include: {
            images: true,
            user: true,
            bids: true,
            likes: true
        }
    })
    return res.json(allPosts)
})






module.exports = routes;
