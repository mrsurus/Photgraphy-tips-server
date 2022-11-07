const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nzh9xhl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri);
async function run(){
    try{
        const reviewCollection = client.db('reviewAssign').collection('review')
    }
    finally{

    }
}
run().catch( err => console.error(err))

app.get('/', (req, res)=> {
    res.send('assignment server is running')
})

app.listen(port, (req, res)=> {
    console.log('server is running on port', port);
})