require('dotenv').config();


const express = require('express');
const routes = express.Router()

const {PrismaClient, Prisma}= require('@prisma/client');

const { NotFoundError, ExistingUserError, NoUserFound  } = require('../middleware/CustomErrors');

const prisma = new PrismaClient();

routes.get("/", async (req, res, next) => {
    const users = await prisma.user.findMany({
        include:{
            likedPosts: {
                include : { post: true }
            }
        }
    })

    return res.json(users)
})

routes.get("/:id", async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id : req.params.id },
            include : {
                bids : true,
                commissions: true,
                posts : true,
                images : true
            }
        })

        res.json(user)
    } catch (error) {
        console.log(error)

        next(new NoUserFound)
    }
})



routes.post("/", async (req, res, next) => {
    try {
        const { id, email } = req.body;

        const user = await prisma.user.create({
            data : {
                id : id,
                userName : email
            }
        })

        res.json({"response":"success"})
    } catch (error) {
        console.log(error)
        next(new ExistingUserError())
    }
})

routes.post("/recommendations", async (req, res, next) => {
    try {
        const {userId, recommendations} = req.body;
        if (recommendations.length == 0){
            return res.json({})
        }

        rec_posts = []
        for (let id in recommendations){
            rec_posts.push ({
                "userId" : userId,
                "postId" : parseInt(recommendations[id])
            })
        }

        const newRecs = await prisma.recommendedPost.createMany({
            data: rec_posts,
            skipDuplicates: true
        })


        res.json(newRecs)
    }catch (error) {
        console.log(error)
        res.json({"response" : "somethign went wrong"})
    }
})


routes.get("/recommendations/:id", async (req, res, next) => {
    try {
        const recs = await prisma.recommendedPost.findMany({
            where: {
                userId: req.params.id
            },
            include : {
                post: {
                    include: {
                        images: true,
                        user: true,
                        bids: true,
                        likes: true
                    }
                }
            }
        })

        res.json(recs)
    }catch (error) {
        console.log(error)
        res.json({"response" : "somethign went wrong"})
    }
})


module.exports = routes;
