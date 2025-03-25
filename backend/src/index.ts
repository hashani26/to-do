import express from "express";
import { corsMiddleware } from "./middlewares/corsMiddleware";
import taskRoutes from "./routes/taskRoutes";

const app = express();
const port = 3001;

app.use(corsMiddleware);
app.use(express.json());
app.use("/api", taskRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
