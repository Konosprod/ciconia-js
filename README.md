# ciconia-js

New implementation for my Ciconia service, nodejs inside because why not.

## Presquisites

Check if you have a mysql server up and running on your machine
`sudo service mysql status`
if you don't, follow [this link](https://linuxize.com/post/how-to-install-mariadb-on-ubuntu-18-04/) to install one

You also need latest node, npm, and curl for later config.
The following should be enough on most systems.
```
sudo apt update
sudo apt install nodejs
sudo apt install npm
sudo apt install curl
```

## setting up the database

Start mysql server if not already
`sudo service mysql start`

Then, if you're running the project for the first time, you'll want to import dummy data and create a dummy mysql user to use by this app.
in bash, do this to open mysql cli :
`sudo mysql`
then, do this to create new user and table for this app
```
CREATE DATABASE ciconia;
CREATE USER 'ciconia'@'localhost' IDENTIFIED BY 'ciconia';
GRANT ALL PRIVILEGES ON ciconia . * TO 'ciconia'@'localhost';
EXIT;
```
Lastly, import dummy database :
`mysql < config/database.sql`

## setting up the node server

create folder for uploads :
`mkdir uploads`

Copy and rename `config/production.json` into `config/local.json` and fill the blanks. With default config, it should be :
```
{
    "port":3000,
    "baseurl": "localhost",
    "base_upload_directory": "uploads",
    "short_url_length": 8,

    "db" : {
        "host": "localhost",
        "password": "ciconia",
        "user": "ciconia",
        "database": "ciconia"
    },

    "thumbnail": {
        "x": 200,
        "y": 200
    }
}
```

then, create a user to login to the app like so
`curl -d '{"user":"example_user","password":"example_pass"}' -H "Content-Type: application/json" http://localhost:3000/register`

You can also use a tool like [Insomnia](https://insomnia.rest/) if you prefer (recommended for debugging).

## setting up sharex to use our app

### Request tab

* Edit settings and custom upload service
* Set `POST` method
* Add header `apikey` and set the value with the user api key you can get in the database
* Add header `username` set the correspond username
* The body must be `Form data (multipart/form-data)`
* Filename is `f`


### Response tab

* Just set the url to `$json:url$`

You are now free to test.

Later, everything will be smoother, with preconfigurer config-files & stuff, but for now, it's still under developpment.

# Running dev environnement

Just do `node src` from project root

# Known issue

* None
