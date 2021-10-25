import path from "path";
import fs from "fs";

const { promisify } = require("util");
const readFile = promisify(fs.readFile);
//artificial delay simulating loading
const delay = (ms) => new Promise((resolve) => { setTimeout(resolve, ms) });

export default async function handler(req, res) {
    const jsonFile = path.resolve("./", "db.json"); 
    try{
        const readFileData = await readFile(jsonFile); 
        await delay(1000); 
        const speakers = JSON.parse(readFileData).speakers; 
        if(speakers) {
            res.setHeader("Context-Type", "application/json"); 
            res.status(200).send(JSON.stringify(speakers, null, 2));
            console.log("GET /api/speaker status: 200"); 
        }
    } catch(e) {
        console.log("api/Speaker error", e); 
        res.status(404).send("File not found on the server!"); 
    }
}
