const express = require("express");
const prisma = require("../prisma");
const jwt = require("jsonwebtoken");
const router = express.Router();
const JWT_PASSWORD = process.env.JWT_PASSWORD;
const { authMiddleware } = require("../middleware");

router.post("/departmentcreation", async (req, res) => {
    const body = req.body;
    console.log("Got the body: ", body);
    if (!body.name || !body.description) {
        console.error({
            message: "Invalid or Insufficent parameters  ",
            error: err,
        });
        res.status(511).json({ message: "Department  creation failed !" });
    }
    try {
        let dept = await prisma.department.findFirst({
            where: {
                name: body.name,
            },
        });
        if (dept) {
            console.log({ message: "Department already exist with same name" });
            res.status(511).json({
                message: "Department already exist with same name",
            });
            return;
        }
        dept = await prisma.department.create({
            data: {
                name: body.name,
                description: body.description,
            },
        });

        res.json({ message: "Department created successfully !" });
    } catch (err) {
        console.error({
            message: "Got the error while creating department ! ",
            error: err,
        });
        res.status(511).json({ message: "Department creation failed !" });
    }
});

router.post("/signup", async (req, res) => {
    //Route for making admins i.e. adding authority
    const body = req.body;
    console.log("Got the body: ", body);
    if (!body.name || !body.email || !body.password || !body.departmentId) {
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
                departmentId: body.departmentId,
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
    //Login route for authority and give information about user 
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
            res.json({ message: "signin successful !", userData: user });
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

router.get("/check-auth", authMiddleware, (req, res) => {
    res.status(200).json({ authenticated: true, userId: req.userId });
});

module.exports = router;
