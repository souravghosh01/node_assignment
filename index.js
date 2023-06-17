const express = require('express')
const mongoose = require('mongoose')
const role = require('./src/route/role')
const member = require('./src/route/member')
const community = require('./src/route/community')
const user = require('./src/route/user')
require('dotenv').config();
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, mongoose.set('strictQuery', false))
    .then(()=> { console.log('Database is connected') })
    .catch((error)=> { console.log(error) })

app.use('/v1/role', role)
app.use('/v1/member', member)
app.use('/v1/auth', user)
app.use('/v1/community', community)

app.listen((port), () => {
    console.log(`Application running on port ${port}`)
})

