const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(
    cors({
        origin: ["http://localhost:5173","http://127.0.0.1:5000"],
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
app.use("/admin",adminRouter);
app.use("/user",userRouter);

app.listen(PORT,()=>{
    console.log(`Server live at http://localhost:${PORT}`)
})