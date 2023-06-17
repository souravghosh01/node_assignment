const roleModel = require('../models/role');
const {validationResult} = require('express-validator');
const snowFlake = require('@theinternetfolks/snowflake');
const genCode = require('../middleware/genCode')


const createRole = async function (req, res) {

        let userInput = req.body;
        try {
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

        let snowFlakeRoleId = snowFlake.Snowflake.generate({ timestamp: Date.now() });
        userInput.id = snowFlakeRoleId;

        let createData = await roleModel.create(userInput);

        let userDetails = {
            id: createData.id,
            name: createData.name,
            createdAt: createData.createdAt,
            updatedAt: createData.updatedAt
        }

        return res.status(201).send(
            { status: true, content: { data: userDetails } }
        );
        
    }catch (error) {
        res.status(500).json({
            status:false,
            error:error.message
        });
    }
}

const getRoles = async  (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const userDetails = await roleModel.find().select({ _id: 0, __v: 0 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await roleModel.countDocuments();
        return res.status(200).send(
            { status: true, content: { meta: { total: count, pages: Math.ceil(count / limit), page: page }, data: userDetails } }
        );
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createRole, getRoles };