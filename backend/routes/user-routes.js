require('dotenv').config();


const express = require('express');
const routes = express.Router()

const {PrismaClient, Prisma}= require('@prisma/client');

const { NotFoundError, ExistingUserError, NoUserFound  } = require('../middleware/CustomErrors');

const prisma = new PrismaClient();

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


module.exports = routes;
