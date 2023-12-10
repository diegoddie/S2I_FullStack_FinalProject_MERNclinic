const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Function to connect to a MongoDB server in-memory for testing purposes
export async function connect(){
    // Create an instance of the MongoDB in-memory server
    const mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()

    await mongoose.connect(mongoUri, {dbName: "testingDb"})
    console.log(`MongoDB successfully connected to ${mongoUri}`)
}