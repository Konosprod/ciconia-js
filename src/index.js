const express = require("express");
const multer = require("multer");
const uuid = require("uuid");
const mysql = require("mysql");
const crypto = require("crypto");
const bodyparser = require("body-parser");
const argon2 = require("argon2");
const fs = require("fs-extra");
const sharp = require("sharp");
const path  = require("path");
const config = require("config");

const app = express();
const port = config.get("port");

const imageType = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/bmp",
    "image/gif"
];

var jsonparser = bodyparser.json();

var connection = mysql.createConnection({
    host: config.get("db.host"),
    user: config.get("db.user"),
    password: config.get("db.password"),
    database: config.get("db.database"),
    multipleStatements: true
});

var basename = config.get("baseurl");

connection.connect(function(err) {
    if(err) {
        throw err;
    }
});


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        var date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const userid = req.header("apikey");
        const dest = path.join(config.get("base_upload_directory"), userid, year.toString(), month.toString());

        if (!fs.existsSync(dest))
        {
            fs.mkdirpSync(dest);
        }

        return cb(null, dest);
    },

    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({
    storage: storage
});

var authentication = function(req, res, next) {
    if(req.header("apikey") && req.header("username")) {
        return next();
    } else {
        var err = new Error(`${req.ip} tried to access ${req.originalUrl} without being authenticated`)
        err.statusCode = 403;
        next(err);
    }
};

function checkDatabase() {
    var query = fs.readFileSync("./config/database.sql", "utf-8");
    connection.query(query, function(err) {
        if(err)
            throw err;
    })
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
};

function generateThumbs(req) {
    const optionsResize = {
        fit: sharp.fit.outside
    };

    if(imageType.includes(req.file.mimetype)) {
        var pathfile = path.join(path.dirname(req.file.path), "thumbs")

        if(!fs.existsSync(path))
            fs.mkdirpSync(pathfile);

        var filename = path.basename(req.file.path);

        sharp(req.file.path).resize(config.get("thumbnail.x"), config.get("thumbnail.y"), optionsResize).toFile(path.join(pathfile, filename), (err) => {
            if(err)
                throw err;
        });
    } else {

    }
};

app.post("/", authentication, upload.single("f"), (req, res, next) => {
    generateThumbs(req);

    var urlId = makeid(config.get("short_url_length"));

    connection.query("SELECT id FROM users WHERE username = ?", req.header("username"), function(err, result) {
        if(err)
            throw err;

            var push = {
                url: urlId,
                path: req.file.path,
                owner: result[0].id
            };

            connection.query("INSERT INTO push SET ?", push, function(err, res) {
                if(err)
                    throw err;
            })
    });

    res.json({url:basename+"/push/" + urlId});
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
            };

            connection.query("INSERT INTO users SET ?", user, function(err, res) {
                if(err)
                    throw err;
            });

            res.sendStatus(201);
        })
    });
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
    checkDatabase();
});
