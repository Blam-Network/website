require("dotenv").config();

const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);
const hostname = "localhost";

// SSL cert paths – set in .env or use defaults
const certPath =
  process.env.SSL_CERT_PATH || path.join(__dirname, ".cert", "cert.pem");
const keyPath =
  process.env.SSL_KEY_PATH || path.join(__dirname, ".cert", "key.pem");

const app = next({ dev, hostname, port });

const requestHandler = app.getRequestHandler();

app.prepare().then(() => {
  let server;

  if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    const options = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
    server = createServer(options, (req, res) => {
      const parsedUrl = parse(req.url, true);
      requestHandler(req, res, parsedUrl);
    });
  } else {
    console.warn(
      `SSL certs not found at ${certPath} and ${keyPath}. Run: npm run ssl:setup`
    );
    const http = require("http");
    server = http.createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      requestHandler(req, res, parsedUrl);
    });
  }

  server
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, dev ? "localhost" : "0.0.0.0", () => {
      const protocol = server instanceof require("https").Server ? "https" : "http";
      console.log(`> Ready on ${protocol}://${dev ? hostname : "0.0.0.0"}:${port}`);
    });
});
