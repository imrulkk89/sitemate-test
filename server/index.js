const express = require('express')
const app = express();

const issues = require('./data/issues.json')

app.use(express.json());

const PORT = process.env.PORT || 3000;




app.get('/read/:id', (req, res) => {

    const id  = parseInt(req.params.id, 10);

    const issue = issues.find( item => item.id === id)

    return res.json(issue)
})

app.get('/', (req, res)=>{
    res.json({status : "Okay"});
})

app.listen(PORT, () => {
    console.log(`server listening on port: ${PORT}`);
});