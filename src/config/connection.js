require("dotenv").config();
const mongoose = require("mongoose");
const { getSecret } = require("./keyvault");

async function putKeyVaultSecretInEnvVar() {
  // add PINECONE_API_KEY 
    const pineconeAPIKey = process.env.KEY_VAULT_SECRET_NAME_PINECONE_API_KEY
    const openaiAPIKey = process.env.KEY_VAULT_SECRET_NAME_OPENAI_API_KEY
    const secretName = process.env.KEY_VAULT_SECRET_NAME_DATABASE_URL;
    const keyVaultName = process.env.KEY_VAULT_NAME;
     
    process.env.PINECONE_API_KEY = pineconeAPIKey;
    process.env.DATABASE_URL = secretName;
    process.env.OPENAI_API_KEY = openaiAPIKey;

    // console.log(secretName);
    // console.log(keyVaultName);
    // console.log(openaiAPIKey);
    
    // if (!secretName || !keyVaultName || !openaiAPIKey) throw Error("getSecret: Required params missing");

    // connectionString = await getSecret(secretName, keyVaultName);
    // openaiAPIKeyString = await getSecret(openaiAPIKey, keyVaultName);

    // process.env.DATABASE_URL = connectionString;
    // process.env.OPENAI_API_KEY = openaiAPIKeyString;
}
async function getPineconeAPIKey() {
  if (!process.env.PINECONE_API_KEY) {

    await putKeyVaultSecretInEnvVar();

    // still don't have a database url?
    if(!process.env.PINECONE_API_KEY){
      throw new Error("No value in PINECONE_API_KEY in env var");
    }
  }

}

async function getConnectionInfo() {
  if (!process.env.DATABASE_URL) {

    await putKeyVaultSecretInEnvVar();

    // still don't have a database url?
    if(!process.env.DATABASE_URL){
      throw new Error("No value in DATABASE_URL in env var");
    }
  }

  // To override the database name, set the DATABASE_NAME environment variable in the .env file
  const DATABASE_NAME = process.env.DATABASE_NAME || "azure-todo-app";

  return {
    PINECONE_API_KEY: process.env.PINECONE_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_NAME: process.env.DATABASE_NAME,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
  }
}

module.exports = {
  getConnectionInfo
}