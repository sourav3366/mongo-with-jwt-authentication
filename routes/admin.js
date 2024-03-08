const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const jwt = require("jsonwebtoken");
const router = Router();
const db = require('../db');
db.connect();
const { Admin, Course } = db;
const config = require("../config");
const JWT_SECRET = config.jwtSecret;

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    // check if a user with this username already exists
    await Admin.create({
        username: username,
        password: password
    })

    res.status(200).json({
        message: 'Admin created successfully'
    })
});

router.post('/signin', async (req, res) => {
    // Implement admin signin logic
    const username = req.body.username;
    const password = req.body.password;
    console.log(JWT_SECRET);

    const user = await Admin.find({
        username,
        password
    })
    if (user) {
        console.log(`jwt secret during signing is ${JWT_SECRET}`)
        const token = jwt.sign({
            username
        }, JWT_SECRET);
        console.log(`token: ${token}`)
        res.status(200).json({
            token
        })
    } else {
        res.status(411).json({
            message: "Incorrect email and pass"
        })
    }
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const imageLink = req.body.imageLink;
    await Course.create({
        title : title,
        description: description,
        price: price,
        imageLink : imageLink,
    })
    .then((newCourse) =>{
        res.status(201).json({
            message: 'Course created successfully', courseId: newCourse._id
        })
    })
});

router.get('/courses', adminMiddleware, (req, res) => {
    // Implement fetching all courses logic
});

module.exports = router;