require("dotenv").config();

const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require("path");
const http = require("http");

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);
const bindHost = process.env.HOST || (dev ? "localhost" : "0.0.0.0");
const hostname = process.env.HOSTNAME || bindHost;

// SSL cert paths – set in .env or use defaults
const certPath =
  process.env.SSL_CERT_PATH || path.join(__dirname, ".cert", "cert.pem");
const keyPath =
  process.env.SSL_KEY_PATH || path.join(__dirname, ".cert", "key.pem");

function loadSslOptions() {
  if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
    return null;
  }

  try {
    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
  } catch (err) {
    console.warn(
      `Could not read SSL certs at ${certPath} / ${keyPath}: ${err.message}. Starting HTTP instead.`
    );
    return null;
  }
}

const app = next({ dev, hostname, port });

const requestHandler = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const sslOptions = loadSslOptions();
    if (!sslOptions) {
      console.warn(
        `No usable SSL certs at ${certPath} / ${keyPath}. Starting HTTP.`
      );
    }
    const server = sslOptions
      ? createServer(sslOptions, (req, res) => {
          const parsedUrl = parse(req.url, true);
          requestHandler(req, res, parsedUrl);
        })
      : http.createServer((req, res) => {
          const parsedUrl = parse(req.url, true);
          requestHandler(req, res, parsedUrl);
        });

    server
      .once("error", (err) => {
        console.error(err);
        process.exit(1);
      })
      .listen(port, bindHost, () => {
        const protocol = sslOptions ? "https" : "http";
        console.log(`> Ready on ${protocol}://${hostname}:${port}`);
      });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });