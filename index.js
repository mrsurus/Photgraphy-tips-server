const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const cors = require('cors')
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nzh9xhl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJwt(req, res, next) {

    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' })
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(401).send({ message: 'unauthorixed access' })
        }
        req.decoded = decoded;
        next()
    })


}

async function run() {
    try {
        const reviewCollection = client.db('reviewAssign').collection('review')
        const givenReviewCollection = client.db('reviewAssign').collection('givenReview')

        app.get('/servicesh', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query)
            const result = await cursor.limit(3).toArray()
            res.send(result)
        })
        app.get('/allservices', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/allservices/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await reviewCollection.findOne(query)
            res.send(result)

        })

        app.post('/jwt', (req, res) => {
            const user = req.body
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' })
            res.send({ token })
        })

        app.post('/allservices', async (req, res) => {
            const info = req.body;
            const result = await reviewCollection.insertOne(info)
            res.send(result)
        })

        app.post('/review', async (req, res) => {
            const data = req.body;
            const result = await givenReviewCollection.insertOne(data)
            res.send(result)
        })

        app.get('/review', verifyJwt, async (req, res) => {
            const decoded = req.decoded
            if (decoded.email !== req.query.email) {
                return res.status(401).send({ message: 'unauthorized access' })
            }
            let query = {}
            if (req.query.email) {
                query = { email: req.query.email }
            }
            console.log(query);
            const result = await givenReviewCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/reviews', async(req,res)=>{
            const query= req.query
            const result = await givenReviewCollection.find(query).toArray()
            res.send(result)
        })

        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await givenReviewCollection.deleteOne(query)
            res.send(result)
        })
        app.get('/review/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await givenReviewCollection.findOne(query)
            res.send(result)
        })

        app.put('/review/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const data = req.body
            const option = { upsert: true }
            const updatedReview = {
                $set: {
                    review: data.review
                }
            }
            const result = await givenReviewCollection.updateOne(filter, updatedReview, option);
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(err => console.error(err))

app.get('/', (req, res) => {
    res.send('assignment server is running')
})

app.listen(port, (req, res) => {
    console.log('server is running on port', port);
})