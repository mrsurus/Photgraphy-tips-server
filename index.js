const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nzh9xhl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const reviewCollection = client.db('reviewAssign').collection('review')

        app.get('/servicesh', async(req, res)=> {
            const query = {}
            const cursor = reviewCollection.find(query)
            const result = await cursor.limit(3).toArray()
            res.send(result)
        })
        app.get('/allservices', async(req, res)=> {
            const query = {}
            const cursor = reviewCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/allservices/:id', async(req, res)=> {
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const result =await reviewCollection.findOne(query)
            res.send(result)
           
        })
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