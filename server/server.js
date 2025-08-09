const express = require("express");
const app = express();
const port = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.end("Hello");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
