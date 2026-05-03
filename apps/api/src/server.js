const { execSync } = require("child_process");

try {
  console.log("Running prisma generate...");
  execSync("npx prisma generate --schema=./prisma/schema.prisma", {
    stdio: "inherit",
  });
} catch (err) {
  console.error("Prisma generate failed:", err);
}

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const http = require("http");
const app = require("./app");
const { initSocket } = require("./socket");
const { verifyEmailTransporter } = require("./utils/email");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`API + Socket server running on port ${PORT}`);
  verifyEmailTransporter().catch(() => null);
});
