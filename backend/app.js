// Main sever file, setup express, middleware and load routes
// app.js (CommonJS version)
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
const os = require("os");

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let name in interfaces) {
    for (let iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address; // e.g., 192.168.1.x
      }
    }
  }
  return "localhost";
}

// Routes
app.use("/api/users", require("./routes/users"));
app.use('/api/feed', require('./routes/feed'));
app.use('/api/matches', require('./routes/matches'));
// app.use('/api/chat', require('./routes/chat'));
app.use("/api/designs", require("./routes/designs"));

app.get("/", (req, res) => {
  res.send("✅ Server is up and running!");
  console.log("hitting");
});

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(
    `🚀 Server running on http://${getLocalIP()}:${process.env.PORT}`
  );
});
