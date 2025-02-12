const express = require("express");

const routes = require("./routes");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();

app.use(express.json());

app.use('/api',routes);
app.use(errorMiddleware);

app.listen(5000,()=>{
    console.log('App listening on port 5000');
});
