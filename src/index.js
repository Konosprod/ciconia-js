const express = require("express");
const multer = require("multer");
const uuid = require("uuid");
const mysql = require("mysql");
const crypto = require("crypto");
const bodyparser = require("body-parser");
const argon2 = require("argon2");
const fs = require("fs-extra");
const sharp = require("sharp");
const path = require("path");
const config = require("config");
const winston = require("winston");
const session = require("express-session");
var cors = require('cors')
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const mimetype = require("mime-types");
const app = express();
app.use(cors())
const port = config.get("port");

const RSA_PRIV_KEY = fs.readFileSync("config/jwtRS256.key");
const RSA_PUBLIC_KEY = fs.readFileSync("config/jwtRS256.key.pub");

const checkIfAuthenticated = expressJwt({
    secret: RSA_PUBLIC_KEY,
    algorithms: ['RS256']
})

const imageType = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/bmp",
    "image/gif"
];


const jsonparser = bodyparser.json();

const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(({ level, message, label, timestamp }) => {
        return `${timestamp} [${label}] ${level}: ${message}`;
    })
);

const logger = winston.createLogger({
    level: config.get("log.level"),
    format: logFormat,
    defaultMeta: {
        label: 'ciconia-js'
    },
    transports: [
        new winston.transports.File({ filename: config.get("log.error_path"), level: "error" }),
        new winston.transports.File({ filename: config.get("log.combined_path") }),
        new winston.transports.Console()
    ]
})

var connection = mysql.createPool({
    host: config.get("db.host"),
    user: config.get("db.user"),
    password: config.get("db.password"),
    database: config.get("db.database"),
    multipleStatements: true,
    connectionLimit: 10
})

/*const connection = mysql.createConnection({
    host: config.get("db.host"),
    user: config.get("db.user"),
    password: config.get("db.password"),
    database: config.get("db.database"),
    multipleStatements: true
});*/

const basename = config.get("baseurl");

/*connection.connect(function (err) {
    if (err) {
        logger.error(err)
        throw err;
    }
});*/

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const userid = req.header("apikey");
        const dest = path.join(config.get("base_upload_directory"), userid, year.toString(), month.toString());

        if (!fs.existsSync(dest)) {
            fs.mkdirpSync(dest);
        }

        return cb(null, dest);
    },

    filename: function (req, file, cb) {

        let filename = file.originalname;

        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const userid = req.header("apikey");

        var filepath = path.join(config.get("base_upload_directory"), userid, year.toString(), month.toString(), filename);

        var nb = 0
        const extension = path.extname(file.originalname);
        const basefilename = path.basename(file.originalname, extension);

        while (fs.existsSync(filepath)) {

            filename = basefilename + "_" + nb.toString() + extension;
            filepath = path.join(config.get("base_upload_directory"), userid, year.toString(), month.toString(), filename)
            nb++;
        }

        cb(null, filename);
    }
});

const upload = multer({
    storage: storage
});

const authentication = function (req, res, next) {

    //Authenciate via headers
    if (req.header("apikey") && req.header("username")) {
        let username = req.header("username")
        let apikey = req.header("apikey")

        let query = "SELECT apikey FROM users WHERE username = ?";

        connection.query(query, username, function (err, res) {
            if (err) {
                logger.error(err);
                next(err);
            }
            //If no user was found, or apikey mismatch, error
            if (res.length <= 0 || res[0].apikey != apikey) {
                var err = new Error(`${req.ip} tried to access ${req.originalUrl} without being authenticated`)
                err.statusCode = 403;

                logger.warn(err);

                next(err);
            } else {
                logger.info(`username : ${username} ; apikey : ${apikey} auth successful`)
                next();
            }
        })
    } else {
        var err = new Error(`${req.ip} tried to access ${req.originalUrl} without being authenticated`)
        err.statusCode = 403;

        logger.warn(err);

        next(err);
    }
};

function checkDatabase() {
    logger.debug("Checking database");
    var query = fs.readFileSync("./config/database.sql", "utf-8");
    connection.query(query, function (err) {
        if (err) {
            logger.error(err);
            throw err;
        }
    })
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};

function generateThumbs(req) {
    const optionsResize = {
        fit: sharp.fit.outside
    };

    var mime = mimetype.lookup(req.file.path);
    var pathfile = path.join(path.dirname(req.file.path), "thumbs")
    var filename = path.basename(req.file.path) + ".png";


    if (imageType.includes(mime)) {

        if (!fs.existsSync(path))
            fs.mkdirpSync(pathfile);

        logger.info("Generating thumbnail for file : " + req.file.path);

        sharp(req.file.path).resize(config.get("thumbnail.x"), config.get("thumbnail.y"), optionsResize).toFile(path.join(pathfile, filename), (err) => {
            if (err) {
                logger.error(err);
                throw err;
            }
        });
    } else {
        //Default thumbnails

        if (mime.startsWith("text/")) {
            fs.copyFileSync("assets/thumb-text.png", path.join(pathfile, filename));
        } else if (mime.startsWith("application/")) {
            fs.copyFileSync("assets/thumb-bin.png", path.join(pathfile, filename));

        } else if (mime.startsWith("audio/")) {
            fs.copyFileSync("assets/thumb-audio.png", path.join(pathfile, filename));

        } else if (mime.startsWith("video/")) {
            fs.copyFileSync("assets/thumb-video.png", path.join(pathfile, filename));

        } else {
            fs.copyFileSync("assets/thumb-bin.png", path.join(pathfile, filename));
        }

    }
};

app.post("/", authentication, upload.single("f"), (req, res, next) => {
    generateThumbs(req);

    var urlId = makeid(config.get("short_url_length"));

    connection.query("SELECT id FROM users WHERE username = ?", req.header("username"), function (err, result) {
        if (err) {
            logger.error(err);
            next(err);
        }

        let push = {
            url: urlId,
            path: path.resolve(req.file.path),
            mime: mimetype.lookup(path.resolve(req.file.path)),
            owner: result[0].id
        };

        logger.debug("Generated push : " + JSON.stringify(push));

        connection.query("INSERT INTO push SET ?", push, function (err, res) {
            if (err) {
                logger.error(err);
                next(err);
            }
        })

        logger.info(`Generated URL : ${urlId} for user : ${result[0].id}`);

        res.json({ url: basename + "/push/" + urlId });
        next();
    });
});

app.get("/push/:id(\\w{" + config.get("short_url_length") + "})/", (req, res, next) => {
    let id = req.params.id;
    let isthumbs = (req.params.hasOwnProperty("thumbs") && req.params.thumbs);
    let sql = "SELECT path FROM push WHERE url = ?";

    connection.query(sql, id, (err, result) => {
        if (err) {
            logger.error(err);
            next(err);
        }

        if (result.length <= 0) {
            logger.warn(`Push ${id} not found`);
            res.sendStatus(404);
        } else {

            if (!isthumbs) {
                res.sendFile(result[0].path);
            } else {
                let basepath = path.dirname(result[0].path);
                let filename = path.basename(result[0].path) + ".png";
                let filepath = path.join(basepath, "thumbs", filename + "");

                res.sendFile(filepath);

            }
        }
    })
});

app.get("/thumbs/:id(\\w{" + config.get("short_url_length") + "})/", (req, res, next) => {
    let id = req.params.id;
    let sql = "SELECT path FROM push WHERE url = ?";

    connection.query(sql, id, (err, result) => {
        if (err) {
            logger.error(err);
            next(err);
        }

        if (result.length <= 0) {
            logger.warn(`Push ${id} not found`);
            res.sendStatus(404);
        } else {
            let basepath = path.dirname(result[0].path);
            let filename = path.basename(result[0].path) + ".png";
            let filepath = path.join(basepath, "thumbs", filename + "");

            res.sendFile(filepath);
        }
    })
});

app.post("/register", jsonparser, function (req, res, next) {

    if (!req.body) {
        logger.warn(`${req.ip} tried to register without sending json payload`)
        return res.sendStatus(404);
    }

    crypto.randomBytes(32, function (err, salt) {
        if (err) {
            logger.error(err);
            next(err);
        }

        argon2.hash(req.body.password, salt).then(hash => {
            var user = {
                username: req.body.username,
                password: hash,
                apikey: uuid.v4()
            };

            connection.query("INSERT INTO users SET ?", user, function (err, res) {
                if (err) {
                    logger.error(err);
                    next(err);
                }
            });

            res.status(201).json({ status: "ok" });

            logger.info(`${req.ip} sucessfully registered : `);
            logger.debug(JSON.stringify(user));

        })
    });
});

app.post("/login", jsonparser, function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    let sql = "SELECT password, id, apikey FROM users WHERE username = ?";

    connection.query(sql, username, function (err, results) {
        if (err) {
            logger.error(err);
            next(err);
            throw err;
        }

        if (results.length <= 0) {
            logger.warn(`User : ${username} not found !`);
            res.status(403).json({ status: "error", message: "Invalid user or password" })
        } else {
            argon2.verify(results[0].password, password).then(result => {
                if (result) {

                    const jwtBearerToken = jwt.sign({key:results[0].apikey}, RSA_PRIV_KEY, {
                        algorithm: "RS256",
                        expiresIn: 84600,
                        subject: results[0].id.toString()
                    })

                    res.status(200).json({
                        idToken: jwtBearerToken,
                        expiresIn: 84600
                    });

                } else {
                    logger.warn(`User : ${username} password mismatch`);
                    res.status(403).json({ status: "error", message: "Invalid user or password" })
                }
            }).catch(err => {
                logger.error(err);
                next(err);
            })
        }
    })

})

app.get("/logout", jsonparser, function (req, res, next) {
    res.json({what:"what"});
})

app.post("/gallery", checkIfAuthenticated, jsonparser, function (req, res, next) {

    let sql = mysql.format("SELECT url, mime FROM push WHERE owner = ? ORDER BY id DESC LIMIT ? OFFSET ?", [req.user.sub, req.body.limit, req.body.offset]);

    connection.query(sql, function (err, result) {
        if (err) {
            logger.error(err);
            next(err);
        } else {
            res.json(result);
        }
    })
})

app.post("/api", checkIfAuthenticated, jsonparser, function (req, res, next) {
    var newkey = uuid.v4();
    var oldkey = req.user.key;

    var sql = mysql.format("UPDATE users SET apikey = ? WHERE id = ?", [newkey, req.user.sub]);

    connection.query(sql, function (err, results) {
        if (err) {
            logger.error(err);
            next(err);
        }

        fs.renameSync(path.join(path.resolve(config.get("base_upload_directory")), oldkey), path.join(path.resolve(config.get("base_upload_directory")), newkey));

        const jwtBearerToken = jwt.sign({ key: newkey }, RSA_PRIV_KEY, {
            algorithm: "RS256",
            expiresIn: 84600,
            subject: req.user.sub
        })

        res.status(200).json({
            idToken: jwtBearerToken,
            expiresIn: 84600
        });
    })

})

app.get('*', function (req, res) {
    res.status(404).send('what???');
});

app.listen(port, () => {
    logger.info(`Listening on port ${port}`)
    checkDatabase();
});
