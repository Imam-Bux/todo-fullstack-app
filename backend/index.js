const express=require('express');
const app=express();
const cors=require('cors')
const todoRoutes=require('./src/todo/route');
const port = process.env.PORT || 4000;
app.use(cors("*"))
app.use(express.json());
app.use('/todo',todoRoutes)
app.listen(port,()=>{
    console.log(`server running on port:${port}`)
})