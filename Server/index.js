import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use('/api/user',userRouter)

connectDB();

app.listen(port,() => {
    console.log(`Server is listening on ${port}`);
})
