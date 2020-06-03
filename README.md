# ciconia-js
New implementation for my Ciconia service, nodejs inside because why not.

# How to setup


## Setup node server

* Setup the database with the .sql
* Copy and rename `config/production.json` into `config/local.json` and fill the blanks
* Launch the server with `node src` at the root of the project
* Add an user by sending a post request to the `/register` endpoint


## Setup sharex

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

# Known issue

* None
