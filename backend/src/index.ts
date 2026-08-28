import express from "express";
import cors from "cors";
import taskRoutes from "./routes/index.js";

const app = express();
const port = process.env.PORT || 3000;
const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({origin: frontendOrigin}));
app.use(express.json());
app.use("/api/task", taskRoutes);
app.listen(port, ()=>{
    console.log(`app is listening on port:${port}`)
});
