function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const token = req.headers.authorization; // bearer token
    const words = token.split(" "); // ["Bearer", "token"]
    const jwtToken = words[1]; // token
    console.log(jwtToken)
    try {
        // console.log(`jwt secret during verifying is ${JWT_SECRET}`)
        // const decodedToken = jwt.decode(jwtToken);
        // console.log(decodedToken);
        const decodedValue = jwt.verify(jwtToken, JWT_SECRET);
        if (decodedValue.username) {
            req.username = decodedValue.username;
            next();
        } else {
            res.status(403).json({
                msg: "You are not authenticated"
            })
        }
    } catch(e) {
        res.json({
            msg: `Incorrect inputs ${e}`
        })
    }
    
}
module.exports = userMiddleware;