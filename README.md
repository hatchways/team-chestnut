# EXPRESS-STARTER


# MangoDb
To Run MongoDb in mac with mongoose, follow three steps
1. Install community edition MongoDb in your local machine following the instructions in the [link](https://docs.mongodb.com/manual/administration/install-community/)
2. Start the MongoDb with brew  `$ brew services start mongodb-community` or manually `$ mongod --config /usr/local/etc/mongod.conf`
3. Install Mongoose node modules if there are not already there, `npm i mongoose` . Now you can require or import mongoose in your files to access local or remote databases.

You can also use mongo in your terminal to check the database. type `$ mongo` and you now you can use [shell commands](https://docs.mongodb.com/manual/mongo/)
