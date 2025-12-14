const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://rabbit1-5soy.vercel.app"
    ]
  })
);

// DB
connectDB();

app.get("/", (req, res) => {
  res.send("WELCOME TO RABBIT API!");
});

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productsRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/checkout", require("./routes/checkoutRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/", require("./routes/subscribeRoute"));

app.use("/api/admin/users", require("./routes/adminRoutes"));
app.use("/api/admin/products", require("./routes/productAdminRoutes"));
app.use("/api/admin/orders", require("./routes/adminOrderRoutes"));

module.exports = app; // 🔥 THIS IS THE KEY
