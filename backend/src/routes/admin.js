const express = require("express");
const prisma = require("../prisma");
const jwt = require("jsonwebtoken");
const router = express.Router();
const JWT_PASSWORD = process.env.JWT_PASSWORD;

router.post("/signup", async (req, res) => {
    //Route for making admins i.e. adding authority
    const body = req.body;
    console.log("Got the body: ", body);
    if (!body.name || !body.email || !body.password || !body.department) {
        console.error({ message: "Invalid credentails  ", error: err });
        res.status(511).json({ message: "Signup failed !" });
    }
    try {
        let user = await prisma.admin.findFirst({
            where: {
                email: body.email,
            },
        });
        if (user) {
            console.log({ message: "User already exist with same emailId" });
            res.status(511).json({
                message: "User already exist with same emailId",
            });
            return;
        }
        user = await prisma.admin.create({
            data: {
                name: body.name,
                email: body.email,
                password: body.password,
                department: body.department,
            },
        });
        const userId = user.id;
        const token = jwt.sign({ userId: userId }, JWT_PASSWORD);
        res.cookie("token", token);
        res.json({ message: "signup successful !" });
    } catch (err) {
        console.error({
            message: "Got the error while signing up ",
            error: err,
        });
        res.status(511).json({ message: "Signup failed !" });
    }
});

router.post("/signin", async (req, res) => {
    //Login route for authority
    const body = req.body;
    console.log("Got the body: ", body);
    if (!body.email || !body.password) {
        console.error({ message: " credentails are missing  ", error: err });
        res.status(511).json({ message: "Signup failed !" });
    }
    try {
        const user = await prisma.admin.findFirst({
            where: {
                email: body.email,
                password: body.password,
            },  
        });
        if (user) {
            const token = jwt.sign({ userId: user.id }, JWT_PASSWORD);
            res.cookie("token", token);
            res.json({ message: "signin successful !" });
        } else {
            console.log({ message: "User not found, check the credentials" });
            res.status(411).json({ message: "User not found !" });
        }
    } catch (err) {
        console.error({
            message: "Got the error while signing up ",
            error: err,
        });
        res.status(511).json({ message: "Signup failed !" });
    }
});
module.exports = router;
