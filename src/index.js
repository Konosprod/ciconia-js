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
const MySQLStore = require("express-mysql-session")(session);
const mimetype = require("mime-types");
const app = express();
const port = config.get("port");

const imageType = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/bmp",
    "image/gif"
];

const storeOptions = {
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: "session_id",
            expires: "expires",
            data: "data"
        }
    },
    endConnectionOnClose: true,
    clearExpired: true,
    checkExpirationInterval: 90000,
    expiration: 86400000,
    createDatabaseTable: true
}


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

const connection = mysql.createConnection({
    host: config.get("db.host"),
    user: config.get("db.user"),
    password: config.get("db.password"),
    database: config.get("db.database"),
    multipleStatements: true
});

const basename = config.get("baseurl");

connection.connect(function (err) {
    if (err) {
        logger.error(err)
        throw err;
    }
});

const sessionStore = new MySQLStore(storeOptions, connection)

app.set("trust proxy", 1);

app.use(session({
    secret: config.get("session.secret"),
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: false,
        sameSite: true,
        secure: config.get("session.cookiesecure")
    },
    store: sessionStore,
    unset: 'destroy'
}))

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
                throw err;
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
        //Authenticate via session
    } else if (req.session.hasOwnProperty("logged") && req.session.logged == true) {
        next();

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
            throw err;
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
                throw err;
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
            throw err;
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
            throw err;
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
            throw err;
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
                    throw err;
                }
            });

            res.status(201).jsonjson({ status: "ok" });

            logger.info(`${req.ip} sucessfully registered : `);
            logger.debug(JSON.stringify(user));

        })
    });
});

app.post("/login", jsonparser, function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    let sql = "SELECT password, id FROM users WHERE username = ?";

    connection.query(sql, username, function (err, results) {
        if (err) {
            logger.error(err);
            next(err);
            throw err;
        }

        if (results.length <= 0) {
            logger.warn(`User : ${username} not found !`);
            res.statusCode(403).json({ status: "error", message: "Invalid user or password" })
        } else {
            argon2.verify(results[0].password, password).then(result => {
                if (result) {
                    req.session.logged = true;
                    req.session.uid = results[0].id;
                    res.json({ status: "ok" });
                    next();
                } else {
                    logger.warn(`User : ${username} password mismatch`);
                    res.statusCode(403).json({ status: "error", message: "Invalid user or password" })
                }
            }).catch(err => {
                logger.error(err);
                throw err;
            })
        }
    })

})

app.get("/logout", jsonparser, function (req, res, next) {
    req.session.destroy((err) => {
        if (err) {
            logger.error(err);
            next(err);
            throw err;
        }

        res.redirect("/");
    })
})

app.post("/gallery", authentication, jsonparser, function (req, res, next) {

    if (!req.body.hasOwnProperty("limit") || !req.body.hasOwnProperty("offset") || !req.session.hasOwnProperty("uid")) {
        logger.warn("Bad request");
        res.sendStatus(400);
    } else {
        let sql = mysql.format("SELECT url, mime FROM push WHERE owner = ? ORDER BY id DESC LIMIT ? OFFSET ?", [req.session.uid, req.body.limit, req.body.offset]);

        connection.query(sql, function (err, result) {
            if (err) {
                logger.error(err);
                next(err);
                throw (err);
            } else {
                res.json(result);
            }
        })
    }
})

app.get('*', function (req, res) {
    res.status(404).send('what???');
});

app.listen(port, () => {
    logger.info(`Listening on port ${port}`)
    checkDatabase();
});
