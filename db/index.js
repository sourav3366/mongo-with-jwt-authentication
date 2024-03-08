const mongoose = require('mongoose');

const mongoURI = "mongodb://127.0.0.1:27017/jwt_practice";
console.log("Connecting to MongoDB");

function connect() {
    mongoose.connect(mongoURI);
    console.log("Connection attempted");
}

function retryConnection() {
    console.log("Retrying connection attempt in 2 seconds");
    console.log(mongoose.connection._closeCalled);
    const retryInterval = setInterval(() => {
        if (!mongoose.connection._closeCalled) {
            console.log("Connection re-established");
            clearInterval(retryInterval);
        } else {
            console.log("Retrying connection attempt in 2 seconds");
            connect();
        }
    }, 5000);
}

mongoose.connection.on('error', (err) => {
    if (err.name === "MongoServerSelectionError") {
        console.error('Server Selection Error: MongoDB server is not reachable or selection failed.');
    } else {
        console.error(`MongoDB connection error: ${err.name}`);
    }
    retryConnection();
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
    retryConnection();
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define schemas
const AdminSchema = new mongoose.Schema({
    // Schema definition here
    username: String,
    password: String
});

const UserSchema = new mongoose.Schema({
    // Schema definition here
    username: String,
    password: String,
    purchasedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
});

const CourseSchema = new mongoose.Schema({
    // Schema definition here
    title: String,
    description: String,
    imageLink: String,
    price: Number
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

// Export the models
module.exports = {
    Admin,
    User,
    Course,
    connect,// Export the connect function to manually connect to the database if needed
    retryConnection, 
};
