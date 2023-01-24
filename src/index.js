const express = require('express');
const app = express();
app.use(express.json());

const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://mnu4513:monu8181@firstcluster.daae6aq.mongodb.net/kanovator-DB", { useNewUrlParser: true })
    .then(() => console.log('mongoDB connected'))
    .catch((err) => console.log(err));

const route = require('./routes/route');
app.use('/', route);

app.listen(3000, () => console.log('express app is runnig on prot' + 3000));