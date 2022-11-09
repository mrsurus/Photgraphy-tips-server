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
        const givenReviewCollection = client.db('reviewAssign').collection('givenReview')

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
        app.post('/allservices', async(req,res)=> {
            const info = req.body;
            console.log(info)
            const result = await reviewCollection.insertOne(info)
            res.send(result)
        })
        app.post('/review', async(req, res)=> {
            const data = req.body;
            const result = await givenReviewCollection.insertOne(data)
            res.send(result)
        })
        app.get('/review', async(req,res)=> {
            const query = req.query
            const result = await givenReviewCollection.find(query).toArray()
            res.send(result)
        })
        app.delete('/review/:id', async(req, res)=> {
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const result = await givenReviewCollection.deleteOne(query)
            res.send(result)
        })
        app.get('/review/:id', async(req, res)=> {
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const result = await givenReviewCollection.findOne(query)
            res.send(result)
        })
        app.put('/review/:id', async(req, res)=> {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)}
            const data = req.body
            const option = {upsert: true}
            const updatedReview = {
                $set:{
                    review: data.review
                }
            }
            const result = await givenReviewCollection.updateOne(filter, updatedReview, option);
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