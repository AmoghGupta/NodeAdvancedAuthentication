const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

url = "mongodb://localhost:27017/node-complete";

let _db;

const mongoConnect = (callback)=>{
    MongoClient.connect(url, { 
        useNewUrlParser: true,
        useUnifiedTopology: true }).then((client)=>{
            console.log("connected to mongo db");
            // storing the connection once its established
            _db = client.db();
            callback(client);
    }).catch((err)=>{
        console.log(err);
        throw err;
    });
}

// for getting access to the connected database
const getDb =()=>{
    if(_db){
        return _db;
    }
    throw 'No DB found';
}

exports.mongoConnect = mongoConnect;    
exports.getDb = getDb;    

