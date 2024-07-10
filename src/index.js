import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "../db/mongo.db.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is listening on port : ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection failed | ERROR: ", error);
  });

app.all("/", (req, res) => {
  console.log("Just got a request!");
  res.send(`
    <center>
      <b style="font-size: 42px;">
        APPARIUM Backend API's are running!
      </b>
    </center>
  `);
});
