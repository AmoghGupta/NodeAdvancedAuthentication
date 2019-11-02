const mongoDB = require("../utils/database"); 
const ObjectId = require('mongodb').ObjectId; 
const rootPath = require('../utils/path');

class Product {
    constructor(body){
        this.title = body.title;
        this.description = body.description;
        this.price = body.price.toString();
        this.userEmail = body.emailId;
    }

    save(){        
         /** CONNECT TO DB */
         const db = mongoDB.getDb();
         return db.collection('products').insertOne(this);
    }

    static fetchAll(emailId){
        /** CONNECT TO DB */
        const db = mongoDB.getDb();
        return db.collection('products').find({"userEmail":emailId}).toArray();
    }

    static findById(productId,){
        /** CONNECT TO DB */
        const db = mongoDB.getDb();
        var o_id = new ObjectId(productId);
        return db.collection('products').findOne({"_id":o_id})
    }
}


module.exports = Product;