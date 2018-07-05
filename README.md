# Movie Recommandation Engine

## Quick Start
### 1. Setup

```
$ npm install
```

### 2. Run locally

* Start Neo4j ([Download & Install](http://neo4j.com/download)) locally and open the [Neo4j Browser](http://localhost:7474).
* Default ID is 'neo4j' and you need to set password as '12345'.
* Install the Movies dataset with `:play movies`, click the statement, and hit the triangular "Run" button.
* Clone this project from GitHub.
* Install MySQL using following Command Prompt command:

```
$ npm install mysql
```
* Install all of dependencies
```
    "bcrypt-nodejs": "latest",
    "body-parser": "~1.18.3",
    "connect-flash": "~0.1.1",
    "cookie-parser": "~1.4.3",
    "ejs": "~2.6.1",
    "express": "~4.16.3",
    "express-session": "~1.15.6",
    "lodash": "~4.17.10",
    "method-override": "~2.3.10",
    "morgan": "~1.9.0",
    "mysql": "^2.15.0",
    "neo4j-driver": "~1.6.1",
    "passport": "0.4.0",
    "passport-google-oauth": "~0.1.5",
    "passport-local": "~1.0.0",
    "passport-twitter": "1.0.4",
    "uuid-v4": "~0.1.0"
```
* Run 'Mysql' on the other Command Prompt to run MySQL server.

```
$ mysql -u root -p
```
* Go to the project path and run 'nodemon' on Command Prompt.

```
$ nodemon
```

### 3. MySQL

[***3.1 Install MySQLDB Community Edition***](https://bitnami.com/stack/wamp)

* Download Bitnami WAMP 5.6.36-2
* Set Password '123456'

***3.2 run MySQL server***
```
 C:\Bitnami\wampstack-5.6.36-2\mysql\bin>mysql -u root -p
 password: 123456
```
* execute manager-windows in the Bitnami Folder
* Start 'MySQL Database'