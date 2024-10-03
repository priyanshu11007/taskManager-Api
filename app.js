const express = require('express');
const mongoose = require('mongoose');
const bodyParser= require('body-parser');
const taskRoute = require('./routes/taskRoutes');
const userRoute = require('./routes/userRoutes');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://priyadarshi6982:2mQokKnpE7XLMH07@cluster0.go7oq.mongodb.net/',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(()=> console.log("DB Connection sucessful"));

const port= 8000;

app.use('/api/tasks',taskRoute);
app.use('/api/users',userRoute);

app.listen(port, ()=>{
    console.log("hello");
    console.log(`app running on the port ${port}`);
})