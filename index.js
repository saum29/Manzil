import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoute from './routes/auth.js'
import usersRoute from './routes/users.js'
import hotelsRoute from './routes/hotels.js'
import roomsRoute from './routes/rooms.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()
dotenv.config()

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to mongodb")
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected" , ()=> {
    console.log("MongoDB disconnected")
})

//middlewares: Able to reach our req and res before sending anything to user
app.use(cors())
app.use(cookieParser())

app.use(express.json())

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

//Added next: callback function

app.use((err,req,res,next) => {
    const errStatus = err.status || 500
    const errMsg = err.message || "Something went wrong!"
    return res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
        stack: err.stack,
    })
})

app.listen(8800, () => {
    connect()
    console.log("Connected to backend!")
});
