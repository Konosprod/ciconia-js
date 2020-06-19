# Ciconia-js

New implementation for my Ciconia service, nodejs inside because why not.

## Presquisites

Check if you have a mysql server up and running on your machine
`sudo service mysql status`
if you don't, follow [this link](https://linuxize.com/post/how-to-install-mariadb-on-ubuntu-18-04/) to install one

You also need latest node, yarn, and curl for later config.
The following should be enough on most systems.
```
sudo apt update
sudo apt install nodejs
sudo apt install curl
```
**TODO**
installation guide for yarn

## Setting up the database

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

## Setting up the node server

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

Lastly, `yarn install`

## Setting up Angular

This project uses angular. You should have this module installed globally on your system as shown in [the official documentation](https://angular.io/guide/setup-local), or you want be able to start angular dev server
To install angular, do :
`npm install -g @angular/cli`

If you run into a permission issue doing this, **DO NOT USE SUDO**, this is bad for your system !
[follow this guide instead](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)

in the simpler cases, you just need to do this

```
nvm install node # "node" is an alias for the latest version
nvm use node # use node latest version in this bash
nvm install-latest-npm
```

try reinstalling angular globally after this, and it should work fine.

Lastly, do :
```
cd front
yarn install
cd ../
```

## Setting up sharex to use our app

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

To start the node API, do
`node src`

API will listen on `localhost:3000`

To start the front, do
```
cd front
ng serve
```

front dev server will listen on `localhost:4200`

# Api doc

| Route | Method | Data | Result |
| ----- | ------ | ---- | ------ |
| /login | POST | `{"username":"user", "password":"pass"}` | either `{"status":"ok"}` or `{"status": "error", "message":"Invalid user or password"}` |
| /logout | GET | NONE | Redirected |
| /register | POST | `{"username":"user", "password":"pass"}` | `{"status":"ok"}`|
| /push/[id] | GET | NONE | File associated with this URL |
| /thumbs/[id] | NONE | Thumbnail associated with this URL |
| /gallery | POST | `{limit: 10, offset: 0}` | Return 10 last push from an user with this form `{"url":[id], "mime":"mimetype"}` |
| /api | POST | NONE | `{"status":"ok", "key": [new api key]}` |
| / | POST | See [this section](#request-tab) to set the correct variables | `{"url": "generated url"}` | 


# Known issue

* None

# Thanks

* [Feather Icons](https://github.com/feathericons/feather)
