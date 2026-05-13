const express = require('express');
const app = express();

const port = 3000;

app.get('/', (req, res)=>{
    res.send("BE for spendora");
});

app.listen(port, ()=>{
    console.log(`Server Running on ${port}`);
});