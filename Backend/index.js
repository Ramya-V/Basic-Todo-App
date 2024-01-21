const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()

const app = express();
const port = 8080;

app.listen(port, () => { console.log(`Server is running in the port ${port}`) });
app.use(express.json());

mongoose.connect(process.env.DB_URL)
.then(()=>{console.log('DB connection is established')})
.catch((e)=>{console.log('DB connection failed')});

