const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const habitsRoutes = require("./routes/habitsRoutes");

app.get("/", (req, res) => {
  res.send("life tracker");
});

app.use("/api", habitsRoutes);

app.listen(3000, () => {
  console.log("App is running");
});
