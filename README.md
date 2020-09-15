# Memory game

The goal is match all pairs of fruits cards before time left.
If you win, your time is save in database.
If your time is one of the top three, it will be displayed !

The game duration is : 45 sec

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development.

- Build tool : Gulp
- Database : MYSQL
- CSS preprocessor : Sass

### Prerequisites

Install and configure MYSQL in your machine

```
https://dev.mysql.com/doc/refman/8.0/en/windows-installation.html
```

Install Gulp cli in global context

```
npm install --global gulp-cli
```

Create database and table

```
CREATE DATABASE memorygame CHARACTER SET utf8 COLLATE utf8_general_ci;
USE memorygame;
```

```
CREATE TABLE games (
id int(11) NOT NULL AUTO_INCREMENT,
duration int(11),
PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
```

Create file .env to add config values with add your credentials

```
URL=http://localhost
API_PORT=3000
DATABASE_NAME=memorygame
DATABASE_TABLE=games
DATABASE_PASSWORD=xxxx
DATABASE_USER=xxxxx
DATABASE_HOST=localhost
```

### Installing

Follow this steps to run development env :

1. Install package

```
npm install
```

2. Launch gulp to run local web server and build project

```
gulp
```

3. In paralele launch API server

```
node public/server/index.js
```

## Build

To build project for production

```
gulp build
```

## API documentation

To test API calls you can use Postman

URL : http://localhost:3000/

### To insert DATA

Request:

```http
POST /game
payload : { "duration" : xx}
```

### To get 3 smallest duration

Request:

```http
GET /game/min
```

Successful Response:

```
{[
    5,
    9,
    10
]}
```

### Status Codes

memorygame returns the following status codes in its API:

| Status Code | Description             |
| :---------- | :---------------------- |
| 200         | `OK`                    |
| 500         | `INTERNAL SERVER ERROR` |

## Authors

- **Laurie Ghione** - _Initial work_

## License

This project is licensed under the MIT License.
