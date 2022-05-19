const express = require('express');
const cors = require('cors')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json())

const uri = "mongodb+srv://todo-user:i2ghanQ4QulB5zEJ@to-do-cluster.4rner.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const taskCollection = client.db('tasks-db').collection('tasks-collection')

const run = async() => {
    try {
        await client.connect();

        app.get('/tasks', async (req, res) => {
            const userEmail = req.headers.email;
            const result = await taskCollection.find({userEmail: userEmail}).toArray();
            res.send(result)
        })

        app.post('/addTask', async(req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        })

        app.delete('/tasks/:id', async (req, res) => {
            const id = ObjectId(req.params.id);
            const query = { _id: id }
            const result = await taskCollection.deleteOne(query);
            res.send(result);

        })

    }
    finally {
        
    }
}

run().catch(e => console.log(e.message));

app.get('/', (req, res) => {
    res.send('Hello World!')
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})