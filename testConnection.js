const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://darlingtonjohn914:On0UNijkSnOA0oVb@cluster0.pji2w.mongodb.net/?retryWrites=true&w=majority&appName=cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
