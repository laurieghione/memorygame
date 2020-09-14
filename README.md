# Memory Game

duration : 30 sec

BUILD TOOL : gulp
BDD : MYSQL

Open command line

## Install project

1. Install package

### `npm install`

2. Install and configure MYSQL in your machine

https://dev.mysql.com/doc/refman/8.0/en/windows-installation.html

3. Create database and table

CREATE DATABASE memorygame CHARACTER SET utf8 COLLATE utf8_general_ci;
USE memorygame;

CREATE TABLE games (
id int(11) NOT NULL AUTO_INCREMENT,
duration int(11),
PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

4. Create file .env to add config values :

URL=http://localhost
API_PORT=3000
DATABASE_NAME=memorygame
DATABASE_TABLE=games
DATABASE_PASSWORD=xxxx
DATABASE_USER=xxxxx
DATABASE_HOST=localhost

5. Install gulp cli in global context

### `npm install --global gulp-cli`

6. Launch gulp to run web server and build project

### `gulp`

7. In paralele launch API server

### `node public/server/index.js`

Option : to build project for production

### `gulp build`

## API DOC

To test API calls use Postman

URL : http://localhost:3000/

TO insert DATA :

## POST /game

body : { "duration" : 15}

TO GET 3 TOP min durations :

## GET /game/min
