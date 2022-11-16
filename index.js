const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const connection_port = '1960';

dotenv.config();
app.use(express.json());

const catgeory_route = require('./Routes/categories');
app.use('/api/categories', catgeory_route);

const registration_route = require('./Routes/registrations');
app.use('/api/registrations', registration_route);

app.listen(connection_port, ()=>{
    console.log(`Backend server is running on port:${connection_port} :)`);
});

mongoose.connect(process.env.DB_URL,()=>{
    useCreateIndex:true
}).then(console.log('DB up and running')).catch(err=>console.log(err));


