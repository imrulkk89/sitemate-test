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




app.get('/read/:id', (req, res) => {

    const id  = parseInt(req.params.id, 10);

    const issue = issues.find( item => item.id === id)

    return res.json(issue)
})

app.post('/create', async (req, res) => {
    const { title, description } = req.body;

    const lastId = issues[issues.length-1].id;

    let data = await fileHandler.readFile(process.env.DATA_FILE);

    data = JSON.parse(data);

    const info = {
        id: lastId + 1,
        title, 
        description
    };

    data.push(info);

    await fileHandler.writeFile(process.env.DATA_FILE, JSON.stringify(data, null, 2));

    console.log(info);

    return res.status(201).json(info);
})

app.put('/update/:id', async (req, res) => {

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

    return res.status(201).json(issueUpdate)
});

app.delete('/delete/:id', async (req, res) => {

    const id  = parseInt(req.params.id, 10);

    const newData = issues.filter(item => item.id !== id);

    await fileHandler.writeFile(process.env.DATA_FILE, JSON.stringify(newData, null, 2));

    console.log(`deleted id ${id}`);

    return res.status(202).json({id})
})

app.get('/', (req, res)=>{
    res.json({status : "Okay"});
})

app.listen(PORT, () => {
    console.log(`server listening on port: ${PORT}`);
});