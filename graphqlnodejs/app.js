const express = require('express'); 
const body = require("body-parser"); 
const bodyParser = require('body-parser');

// variable
const app = express(); 

// middlewares
app.use(bodyParser.json());


app.listen(3000);