const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    //connects using the link copied from the connection string
    MongoClient.connect('mongodb+srv://Jeris:VWmtMnAk2SRMlaaS@cluster0.riltt.mongodb.net/shop?retryWrites=true&w=majority'
    )
    .then(client => {
        console.log('Connected!');
        //stores connection to db in _db variable
        _db = client.db() 
        callback();
    })
    .catch(err => {
        console.log(err);
        throw err; //throw err when fail
    });
};

const getDb = () => {
    //if _db is set return access to db.
    if (_db) {
        return _db;
    }
    throw 'No db found';
};

//exports mongoConnect
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;


