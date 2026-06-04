import express from "express";
import offersRouter from "./routes/offers";

const app = express();
app.use(express.json());

app.use("/offers", offersRouter);

const PORT = Number(process.env.PORT);
if (!PORT) {
  console.error("PORT environment variable is required (4001~4004)");
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Seller agent listening on port ${PORT}`);
});
