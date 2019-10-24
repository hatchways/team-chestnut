# Bakery Shop

A platform that allows bakers to sell custom cakes (cookies, cupcakes. etc.) for events (wedding, birthday parties, etc.)! There is a movement toward customization and this website is to allow people to request and shop for their dream cake.

Scope of Project:
	• Create a platform for bakers to create personal shops to upload their designs (cakes, cupcakes, cookies, etc.)
	• Payments - Shoppers can come on the platform and shop for baking goods or request a custom design by a baker they like
	• Filter feed to shop - filter by type of bake goods, price
    Messenger for bakers and shoppers to discuss customized orders

# MangoDb
To Run MongoDb in mac with mongoose, follow three steps
1. Install community edition MongoDb in your local machine following the instructions in the [link](https://docs.mongodb.com/manual/administration/install-community/)
2. Start the MongoDb with brew  `$ brew services start mongodb-community` or manually `$ mongod --config /usr/local/etc/mongod.conf`
3. Install Mongoose node modules if there are not already there, `npm i mongoose` . Now you can require or import mongoose in your files to access local or remote databases.

You can also use mongo in your terminal to check the database. type `$ mongo` and you now you can use [shell commands](https://docs.mongodb.com/manual/mongo/)

# S3 Bucket
1. Create an S3 bucket
2. Add the following to the bucket policy and update it with the name of the bucket created:
```json
{
    "Version": "2012-10-17",
    "Id": "Policy1488494182833",
    "Statement": [
        {
            "Sid": "Stmt1488493308547",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::172016543521:user/name"
            },
            "Action": [
                "s3:ListBucket",
                "s3:ListBucketVersions",
                "s3:GetBucketLocation",
                "s3:Get*",
                "s3:Put*"
            ],
            "Resource": "arn:aws:s3:::bucket-name"
        }
    ]
}
```
3. Add the following to CORS configuration:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <MaxAgeSeconds>3000</MaxAgeSeconds>
    <AllowedHeader>Authorization</AllowedHeader>
</CORSRule>
</CORSConfiguration>
```
4. Create a IAM user, record access key ID and secret key, and add USER ARN to the bucket policy created in step 2(statement>principal>AWS)
5. create an inline-policy for the user containing the following with your bucket name:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListAllMyBuckets",
                "s3:PutObject",
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::bucket-name"
            ]
        }
    ]
}
```
6. Update the .env file with the following variables:
BUCKET_NAME
IAM_USER_KEY
IAM_USER_SECRET
BUCKET_REGION

# Linter: ESLint + Prettier
In order to use ESLint and Prettier efficiently in Visual Studio Code install to following extensions:
    ESLint - Visual Studio Marketplace
    Prettier - Code formatter - Visual Studio Marketplace
Auto format javascript documents by pressing cmd + shift  + P and click Format Document

# Server logger
The server user Winston logger for logging. The logs will be in the utils/logs. 