'use strict';

const { MongoClient } = require("mongodb");

// Replace the uri string with your MongoDB deployment's connection string.
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}.myptw.mongodb.net?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

let connected = false;

exports.getAll = async (dbName, collectionName, dbStayConnected) => {
  try {
    if(!connected) {
      await client.connect();
      connected = true;
    }

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const results = await collection.find({});

    let resultsJSON = [];
    results.forEach((result) => {
      resultsJSON.push(result);
    })

    return resultsJSON;
  } finally {
    // Ensures that the client will close when you finish/error
    if(!dbStayConnected) {
      await client.close();
      connected = false;
    }
  }
};

exports.insert = async (dbName, collectionName, obj, dbStayConnected) => {
  try {
    if(!connected) {
      await client.connect();
      connected = true;
    }

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    await collection.insertOne(obj);
  } finally {
    // Ensures that the client will close when you finish/error
    if(!dbStayConnected) {
      await client.close();
      connected = false;
    }
  }
};
