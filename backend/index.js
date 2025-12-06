const express = require("express");

const cors = require("cors");
const app = express();
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const allowedOrigins = process.env.ALLOWED_ORIGINS;
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.cor;
const rfpRoutes = require("./routes/rfp");
const proposalRoutes = require("./routes/proposal");
require("./models/associations");
app.use("/rfps", rfpRoutes);
app.use("/proposals", proposalRoutes);
app.listen(process.env.BACKEND_PORT, () => {
  console.log(`Server is running on port ${process.env.BACKEND_PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
