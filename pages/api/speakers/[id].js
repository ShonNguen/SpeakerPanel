import path from "path";
import fs from "fs";

const { promisify } = require("util");
const readFile = promisify(fs.readFile);
//write on json file after successful PUT operation 
const writeFile = promisify(fs.writeFile);
//artificial delay simulating loading
const delay = (ms) => new Promise((resolve) => { setTimeout(resolve, ms) });

export default async function handler(req, res) {
    const method = req?.method;
    const id = parseInt(req?.query.id);
    const recordFromBody = req?.body;
    const jsonFile = path.resolve("./", "db.json");
    switch (method) {
        case "POST":
            await postMethod();
            break;
            //typo mistake PUt - watch terminal
            //not updating favorite
        case "PUT":
            await putMethod();
            break;
        case "DELETE":
            await deleteMethod();
            break;
        default:
            res.status(501).send(`Method ${method} not implemented`);
            console.log(`Method ${method} not implemented`);
    }


    async function putMethod() {
        try {
            const readFileData = await readFile(jsonFile);
            await delay(1000);
            const speakers = JSON.parse(readFileData).speakers;
            if (!speakers) {
                res.status(404).send("File not found on the server!");
            } else {
                const newSpeakersArray = speakers.map(function (rec) {
                    return rec.id == id ? recordFromBody : rec;
                });
                writeFile(jsonFile, JSON.stringify( {speakers: newSpeakersArray }, null, 2 )); 
                res.setHeader("Context-Type", "application/json");
                res.status(200).send(JSON.stringify(recordFromBody, null, 2));
                console.log(`PUT /api/speaker ${id} status: 200`);
            }
        } catch (e) {
            res.status(500).send(`PUT /api/speaker ${id} status: 500 unexpected error`)
            console.log("api/Speaker error", e);
        }
    }

    async function postMethod() {
        try {
            const readFileData = await readFile(jsonFile);
            await delay(1000);
            const speakers = JSON.parse(readFileData).speakers;
            if (!speakers) {
                res.status(404).send("File not found on the server!");
            } else {
                const idNew = speakers.reduce( (accumulator, currentValue) => {
                    const idCurrent = parseInt(currentValue.id); 
                    return idCurrent > accumulator ? idCurrent : accumulator
                }, 0) + 1; 

                const newSpeakersRec = { ...recordFromBody, id: idNew.toString()};
                const newSpeakersArray = [newSpeakersRec, ...speakers]; 
                writeFile(jsonFile, JSON.stringify( {speakers: newSpeakersArray }, null, 2 )); 
                res.setHeader("Context-Type", "application/json");
                res.status(200).send(JSON.stringify(newSpeakersRec, null, 2));
                console.log(`POST /api/speaker ${id} status: 200`);
            }
        } catch (e) {
            res.status(500).send(`POST /api/speaker ${id} status: 500 unexpected error`)
            console.log("api/Speaker error", e);
        }
    }

    async function deleteMethod() {
        try {
            const readFileData = await readFile(jsonFile);
            await delay(1000);
            const speakers = JSON.parse(readFileData).speakers;
            if (!speakers) {
                res.status(404).send("File not found on the server!");
            } else {
                const newSpeakersArray = speakers.filter( function(rec) {
                    return rec.id != id;    
                })
                writeFile(jsonFile, JSON.stringify( {speakers: newSpeakersArray }, null, 2 )); 
                res.setHeader("Context-Type", "application/json");
                res.status(200).send(JSON.stringify(recordFromBody, null, 2));
                console.log(`DELETE /api/speaker ${id} status: 200`);
            }
        } catch (e) {
            res.status(500).send(`DELETE /api/speaker ${id} status: 500 unexpected error`)
            console.log("api/Speaker error", e);
        }
    }


}