const memberModel = require('../models/member');
const snowFlake = require('@theinternetfolks/snowflake');
const {validationResult} = require('express-validator');
const genCode = require('../middleware/genCode')

const addMember = async function (req, res) {
    try {
        let userInput = req.body;
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

        let snowFlakeMemberId = snowFlake.Snowflake.generate({ timestamp: Date.now() });
        userInput.id = snowFlakeMemberId;

        let createData = await memberModel.create(userInput);

        let userDetails = {
            id: createData.id,
            community: createData.community,
            user: createData.user,
            roll: createData.role,
            createdAt: createData.createdAt
        };

        return res.status(201).send(
            { status: true, content: { data: userDetails } }
        );
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}


const removeMember = async function (req, res) {
    try {
        const userId = req.data; 
        const { id: memberId } = req.params; 
        const member = await memberModel.findOne({ id: memberId });

        const loggedMember = await memberModel.findOne({ user: userId, community: member.community }).populate('role');

        if (!member) {
            return res.status(404).json({
                status: false,
                errors: [
                    {
                        message: "Member not found.",
                        code: "RESOURCE_NOT_FOUND"
                    }
                ]
            });
        } else if (!loggedMember || loggedMember.role.name === "Community Member") {
            return res.status(403).json({
                status: false,
                errors: [
                    {
                        message: "You are not authorized to perform this action.",
                        code: "NOT_ALLOWED_ACCESS"
                    }
                ]
            });
        } else {
            await memberModel.findOneAndDelete({ id: memberId });
            return res.status(200).json({
                status: true
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: false,
            error: error.message
        });
    }
}



module.exports = { addMember, removeMember };