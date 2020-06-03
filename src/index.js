const express = require("express");
const multer = require("multer");
const uuid = require("uuid");
const mysql = require("mysql");
const crypto = require("crypto");
const bodyparser = require("body-parser");
const argon2 = require("argon2");
const fs = require("fs-extra");
const sharp = require("sharp");

const app = express();
const port = 3000;

var jsonparser = bodyparser.json();

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "test123",
    database: "ciconia"
});

var basename = "http://localhost:3000";

connection.connect(function(err) {
    if(err) {
        throw err;
    }
})

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        var date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const userid = req.header("apikey")
        const dest = `./uploads/${userid}/${year}/${month}`

        if (!fs.existsSync(dest))
        {
            fs.mkdirpSync(dest);
        }

        return cb(null, dest);
    },

    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
})

var upload = multer({
    storage: storage
})

var authentication = function(req, res, next) {
    if(req.header("apikey") && req.header("username")) {
        return next();
    } else {
        var err = new Error(`${req.ip} tried to access ${req.originalUrl} without being authenticated`)
        err.statusCode = 403;
        next(err);
    }
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
}

function generateThumbs(req) {
    console.log(req.file.mimetype);
}

app.post("/", authentication, upload.single("f"), (req, res, next) => {
    generateThumbs(req);
    res.json({url:basename+"/push/" + makeid(8)})
});

app.get("/push/$id", (req, res) => {

});

app.post("/register", jsonparser, function(req, res) {
    if(!req.body) 
        return res.sendStatus(404);

    crypto.randomBytes(32, function(err, salt) {
        if(err)
            throw err;
        
        argon2.hash(req.body.password, salt).then(hash => {
            var user = {
                username : req.body.username,
                password : hash,
                apikey : uuid.v4()
            }
            connection.query("INSERT INTO users SET ?", user, function(err, res) {
                if(err)
                    throw err;
            }) 
            res.sendStatus(201);
        })
    });
});


app.listen(port, () => console.log(`Listening on port ${port}`))
