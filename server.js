require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition:{
        info:{
            title:'Secured REST API',
            description:"User Information",
            contact:{
                name:"Lucas Developer"
            },
            servers:["http://localhost:3000"]
        }
    },
    apis:['.routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express();
mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log('Database Connected')
    app.listen(process.env.PORT || 3000 ,()=>{
        console.log(`Server Started at port ${process.env.PORT}`)
    })
}).catch(console.log)

app.use(cors());
app.use(express.json());
//app.use('/api/docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));
app.use('/api/users',userRouter);