import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import doctorRouter from './routes/doctorRoutes.js';
import connectDB from './config/db.js';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use('/api/doctor',doctorRouter)

connectDB();

app.listen(port,() => {
    console.log(`Server is listening on ${port}`);
})
