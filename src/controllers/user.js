const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const snowflake = require('@theinternetfolks/snowflake');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const genCode = require('../middleware/genCode')


const createUser = async function (req, res) {
    try {
        let userInput = req.body;
        let {password} = userInput;
        const errors = validationResult(req);
            if (!errors.isEmpty()) {

                const extractedErrors = errors.array().map((error) => ({
                    param: error.path,
                    message: error.msg,
                    code: genCode(error.msg)
                  }));

                  
              return res.status(400).json({
                success: false,
                error: extractedErrors,
              });
            }       
        let hash = await bcrypt.hash(password, 10);
        userInput.password = hash;

        let snowFlake = snowflake.Snowflake.generate({ timestamp: Date.now() });
        userInput.id = snowFlake;

        let createData = await userModel.create(userInput);

        const accessToken = jwt.sign({ userId: createData.id, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) }, 'mysignature');

        let userDetails = {
            id: createData.id,
            name: createData.name,
            email: createData.email,
            createdAt: createData.createdAt
        }

        return res.status(201).send(
            { status: true, content: { data: userDetails, meta: { accessToken } } }
        );
    } catch (error) {
        res.status(500).json({
            status:false,
            error:error.message
        });
    }
}


const loginUser = async function (req, res) {
    try {
        const { email, password } = req.body
        const errors = validationResult(req);
            if (!errors.isEmpty()) {

                const extractedErrors = errors.array().map((error) => ({
                    param: error.path,
                    message: error.msg,
                    code: genCode(error.msg)
                  }));
                  return res.status(400).json({
                    success: false,
                    error: extractedErrors,
                  });
            }
        let presentUser = await userModel.findOne({ email })
        if (!presentUser) return res.status(400).send({ status: false, message: 'Invalid email' })

        let comparePassword = await bcrypt.compare(password, presentUser.password)
        if (!comparePassword) return res.status(400).send({ status: false, message: 'Incorrect password' })

        const accessToken = jwt.sign({ userId: presentUser.id, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) }, 'mysignature');

        let userDetails = {
            id: presentUser.id,
            name: presentUser.name,
            email: presentUser.email,
            createdAt: presentUser.createdAt
        }

        return res.status(200).send(
            { status: true, content: { data: userDetails, meta: { accessToken } } }
        );
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


const getUser = async function (req, res) {
    try {
        let decodedToken = req.decodedToken;
        let userId = decodedToken.userId;
        let presentUser = await userModel.findOne({ id: userId });
        if (!presentUser) return res.status(404).send({ status: false, message: 'User not found!' });
        let userDetails = {
            id: presentUser.id,
            name: presentUser.name,
            email: presentUser.email,
            createdAt: presentUser.createdAt
        }
        return res.status(200).send(
            { status: true, content: { data: userDetails } }
        );
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}


module.exports = { createUser, loginUser, getUser };