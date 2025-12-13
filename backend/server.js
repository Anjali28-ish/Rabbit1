const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./Routes/userRoutes");
const productsRoutes = require("./Routes/productsRoutes");
const cartRoutes = require("./Routes/cartRoutes");
const checkoutRoutes = require("./Routes/CheckoutRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const uploadRoutes = require("./Routes/uploadRoutes");
const subscribeRoute = require("./Routes/subscribeRoute");
const adminRoutes = require("./Routes/adminRoutes");
const productAdminRoutes = require("./Routes/productAdminRoutes");
const adminOrderRoutes = require("./Routes/adminOrderRoutes");

dotenv.config();

const app = express();
app.use(express.json());

// ✅ CORS setup (handles preflight automatically)
app.use(cors({
origin: "http://localhost:5173",
methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
credentials: true,
}));

const PORT = process.env.PORT || 3000;

connectDB();

app.get("/", (req, res) => {
res.send("WELCOME TO RABBIT API!");
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", subscribeRoute);

// Admin Routes
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});
