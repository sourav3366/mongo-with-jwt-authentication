const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const db = require('../db');
const { jwtSecret } = require("../config");
db.connect();
const { User, Course } = db;

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;
    await User.create({
        username : username,
        password: password,
    })
    res.status(200).json({
        message : 'User created successfully',
    })

});

router.post('/signin', async (req, res) => {
    // Implement admin signin logic
    const username = req.body.username;
    const password = req.body.password;
    console.log(JWT_SECRET);

    const user = await User.find({
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

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    try{
        const courses = await Course.find({})
        res.status(200).json({
            courses: courses
        })
    }catch(err){
        res.status(411).json({
            message : err.message
        })
    }
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const username = req.username;
    await User.updateOne({
        username: username
    }, {
        "$push": {
            purchasedCourses: courseId
        }
    })
    res.json({
        message: "Purchase complete!"
    })

});

router.get('/purchasedCourses', userMiddleware, async(req, res) => {
    // Implement fetching purchased courses logic
    const user = await User.findOne({
        username: req.username
    });

    const courses = await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    });

    res.json({
        courses: courses
    })
});

module.exports = router