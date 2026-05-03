require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const http = require("http");
const app = require("./app");
const { initSocket } = require("./socket");
const { verifyTransporter } = require("./utils/email");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`API + Socket server running on port ${PORT}`);
  verifyTransporter().catch(() => null);
});
