# Neo4jVisualization

## Quick Start
### 1. Basic Setup
* Following list of programs are needed in order to run this demo
    * Neo4j (Server or Desktop)
    * Node.js
    * MariaDB

### 2. Neo4j
* Start Neo4j ([Download & Install](http://neo4j.com/download)) locally and open the [Neo4j Browser](http://localhost:7474).
* Default ID is 'neo4j' and you need to set password as 'admin'.
* Download the Movies dataset with `:play movies`, click the 'CREATE' statement, and hit the triangular "Run" button.

### 3. MySQL Server For Windows 


[***3.1 Download Bitnami (MySQL server)***](https://bitnami.com/stack/wamp)


* Download Bitnami WAMP 5.6.36-2 ver. 
* Set MySQL Password '123456'

***3.2 install MySQL server***
* Install MySQL using following Command Prompt command:
```
$ npm install mysql
```

***3.3 run MySQL server***
```
 C:\Bitnami\wampstack-5.6.36-2\mysql\bin>mysql -u root -p
 password: 123456
```
* execute manager-windows in the Bitnami Folder
* Start 'MySQL Database'

***3.4 Creating Database***
```sql
mysql> CREATE DATABASE IF NOT EXISTS UserInfo;
```

***3.5 Creating a Table***
```sql
mysql> USE UserInfo
mysql> CREATE TABLE IF NOT EXISTS Users (id INT AUTO_INCREMENT PRIMARY KEY, profileid VARCHAR(30), token VARCHAR(200), email VARCHAR(30), password VARCHAR(100))
```

### 4. Node.js
* Clone this project from GitHub, and install necessary modules by running the following command in the project directory.
```
$ npm install
```
* Go to the project path and run 'npm start' on the terminal.

```
$ npm start
```