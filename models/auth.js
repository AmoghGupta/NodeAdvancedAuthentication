const mongoDB = require("../utils/database"); 
const ObjectId = require('mongodb').ObjectId; 
const rootPath = require('../utils/path');

class AuthModel {
    constructor(body){
        this.emailId = body.email;
        this.password = body.password;
    }

    save(){        
         /** CONNECT TO DB */
         const db = mongoDB.getDb();
         return db.collection('authorization').insertOne(this);
    }

    static fetchAllUsers(){
        /** CONNECT TO DB */
        const db = mongoDB.getDb();
        return db.collection('authorization').find().toArray();
    }

    static findByEmailId(email){
        /** CONNECT TO DB */
        const db = mongoDB.getDb();
        return db.collection('authorization').findOne({"emailId":email});
    }

    static updateUserRecord(resetObject){
        /** CONNECT TO DB */
        const db = mongoDB.getDb();
        return db.collection('authorization').update(
            { emailId: resetObject["email"] },
            {
                $set: {
                    resetToken: resetObject["resetToken"],
                    resetExpiration: resetObject["resetExpiration"]
                }
            }
         );
    }

    static findUserByToken(resetToken){
        /** CONNECT TO DB */
        const db = mongoDB.getDb();
        return db.collection('authorization').findOne({"resetToken":resetToken});
    }

    static updateUserPassword(userDetails){
        /** CONNECT TO DB */
        const db = mongoDB.getDb();
        return db.collection('authorization').update(
            { emailId: userDetails["emailId"] },
            {
                $set: {
                    password: userDetails["password"],
                    resetExpiration: "",
                    resetToken: ""
                }
            }
         );
    }
}


module.exports = AuthModel;