import express from "express";
import cors from "cors";
import taskRoutes from "./routes/index.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: [
    "http://localhost:5173", // For local development
    "https://task-flow-gold-seven.vercel.app" 
  ],
  credentials: true 
}));
app.use(express.json());
app.use("/api/task", taskRoutes);
app.listen(port, ()=>{
    console.log(`app is listening on port:${port}`)
});
