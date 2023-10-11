const express = require('express')
const app = express();
const fs = require('fs')

const dotEnv = require('dotenv');
dotEnv.config();

const fileHandler = fs.promises;

const issues = require('./data/issues.json');
const { ADDRGETNETWORKPARAMS } = require('dns');

app.use(express.json());

const PORT = process.env.PORT || 3000;




app.get('/read/:id', async (req, res) => {
    try {

        const id  = parseInt(req.params.id, 10);

        let data = await fileHandler.readFile(process.env.DATA_FILE);

        data = JSON.parse(data);

        const issue = data.find( item => item.id === id)

        return res.json(issue)
        
    } catch (error) {
        throw error
    }
    
})

app.post('/create', async (req, res) => {

    try {

        const { title, description } = req.body;

        let data = await fileHandler.readFile(process.env.DATA_FILE);

        data = JSON.parse(data);

        const lastId = data[data.length-1].id;

        const info = {
            id: lastId + 1,
            title, 
            description
        };

        data.push(info);

        await fileHandler.writeFile(process.env.DATA_FILE, JSON.stringify(data, null, 2));

        console.log(info);

        return res.status(201).json(info);
        
    } catch (error) {
        throw error;
    }

    
})

app.put('/update/:id', async (req, res) => {

    try {

        const id  = parseInt(req.params.id, 10);

        const { title, description } = req.body;

        const issueUpdate = {
            id,
            title,
            description
        }

        const udpated = issues.map( item => {
            if(item.id === id ){
                return issueUpdate
            } else 
                return item
        });

        console.log(`updated: ${JSON.stringify(issueUpdate, null, 2)}`)

        await fileHandler.writeFile(process.env.DATA_FILE, JSON.stringify(udpated, null, 2));

        return res.status(201).json(issueUpdate);
        
    } catch (error) {
        throw error
    }

    
});

app.delete('/delete/:id', async (req, res) => {

    try {
        const id  = parseInt(req.params.id, 10);

        const newData = issues.filter(item => item.id !== id);

        await fileHandler.writeFile(process.env.DATA_FILE, JSON.stringify(newData, null, 2));

        console.log(`deleted id ${id}`);

        return res.status(202).json({id})
        
    } catch (error) {
        throw error
    }
})

app.get('/', async (req, res)=>{
    try {

        let data = await fileHandler.readFile(process.env.DATA_FILE);

        data = JSON.parse(data);

        return res.status(200).json(data)

    } catch (error) {
        throw error
    }
    
})

app.listen(PORT, () => {
    console.log(`server listening on port: ${PORT}`);
});