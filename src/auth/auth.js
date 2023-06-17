const jwt = require('jsonwebtoken')


const authentication = async function (req, res, next) {
    try {
        let authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).send({ status: false, "errors": [
                {
                  message: "You need to sign in to proceed.",
                  code: "NOT_SIGNEDIN"
                }
              ]});
        }

        const bearer = authHeader.split(" ");
        const bearerToken = bearer[1];

        jwt.verify(bearerToken, 'mysignature', function (error, decodedToken) {
            if (error) {
                return res.status(401).send({ status: false, message: "Invalid token " })
            } else {
                req.decodedToken = decodedToken;
                return next()
            }
        })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { authentication }