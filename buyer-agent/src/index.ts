import "dotenv/config";
import express from "express";
import { connectMongoDB } from "./db";
import decisionsRouter from "./routes/decisions";

const app = express();
app.use(express.json());
app.use("/decisions", decisionsRouter);

const port = Number(process.env.PORT ?? 3000);

async function startServer(): Promise<void> {
  try {
    await connectMongoDB();
    app.listen(port, () => {
      console.log(`Buyer agent listening on port ${port}`);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed to start buyer agent: ${message}`);
    process.exitCode = 1;
  }
}

void startServer();
