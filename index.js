const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
//middlewares
app.use(cors());
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.asca0m7.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const database = client.db("taskCollection");
    const taskCollection = database.collection('task');
  //all tasks 
  app.get('/task',async(req,res) =>{
    const result = await taskCollection.find().toArray();
    res.send(result);
})
app.post('/task',async(req,res) =>{
  const item = req.body;
    const result = await taskCollection.insertOne(item);
            res.send(result);
})
app.delete('/task/:id',async(req,res)=>{
    const id = req.params.id;
    const query= {_id: new ObjectId(id) };
    const result = await taskCollection.deleteOne(query);
    res.send(result);
  })
  app.put('/task/update/:id',async(req,res)=>{
    const id = req.params.id;
    const updatedUser = req.body;
    console.log(updatedUser);
    const filter = {_id: id};
    const options = { upsert: true };
    const userUpdate = {
      $set: {
        title: updatedUser.title,
        deadline : updatedUser.deadline,
        priority: updatedUser.priority,
        shortDesc: updatedUser.shortDesc,
       
      },
    }
    const result = await taskCollection.updateOne(filter, userUpdate, options);
    res.send(result)

   })
   
// app.get('/packages/:id',async(req,res) =>{
//    const id = req.params.id;
//    const query = {_id: new ObjectId(id)}
//    const result = await packageCollection.findOne(query);
//     res.send(result);
// })




  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', function (req, res) {
    
    res.send('Task is sitting ')
   })
app.listen(port , () => {
    
    console.log(`Task Mangement is sitting  on port ${port}`)
   })