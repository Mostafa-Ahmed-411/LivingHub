require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./config/db");
const chatSocket = require("./socket/chatSocket");

// تأمين تشغيل الـ JWT لو المتغير مش مقروء من الـ .env لأي سبب في الكاش
if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = "mySuperSecretFallbackKey123456!!!";
}

// Handle uncaught exceptions gracefully
process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION! Shutting down...");
    console.error(err.name, err.message);
    process.exit(1);
});

// Connect to Database
connectDB();

// جعل البورت يقرأ من الـ .env أو 5000 كقيمة افتراضية
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: [
            process.env.CLIENT_URL || "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:5174",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174",
        ],
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Setup chat sockets
chatSocket(io);

// Start Server
server.listen(PORT, () => {
    console.log(
        `Server is running on port>> ${PORT} in ${process.env.NODE_ENV || "development"} mode`,
    );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION! Shutting down...");
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});