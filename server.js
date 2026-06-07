require("dotenv").config({ override: true });

const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require("path");
const http = require("http");

const dev = process.env.NODE_ENV !== "production";

function resolveBindHost() {
  // BIND_HOST avoids colliding with the shell's HOST variable (often unset or unrelated).
  const configured = (process.env.BIND_HOST || process.env.HOST || "").trim();
  if (configured) {
    return configured;
  }
  return dev ? "localhost" : "0.0.0.0";
}

function resolveDisplayHostname(bindHost) {
  const configured = (process.env.HOSTNAME || "").trim();
  if (configured) {
    return configured;
  }
  return bindHost === "0.0.0.0" ? "localhost" : bindHost;
}

function resolvePort() {
  return parseInt(process.env.PORT || "3000", 10);
}

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

const port = resolvePort();
const bindHost = resolveBindHost();
const hostname = resolveDisplayHostname(bindHost);

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

    const listenHost = resolveBindHost();
    const listenPort = resolvePort();
    const displayHost = resolveDisplayHostname(listenHost);
    const protocol = sslOptions ? "https" : "http";

    console.log(`> Binding ${protocol} server to ${listenHost}:${listenPort}`);

    server
      .once("error", (err) => {
        if (err && err.code === "EADDRINUSE") {
          console.error(
            `Port ${listenPort} is already in use on ${listenHost}. ` +
              `Stop the other process, change PORT, or set BIND_HOST to a specific interface IP.`,
          );
        } else {
          console.error(err);
        }
        process.exit(1);
      })
      .listen(listenPort, listenHost, () => {
        console.log(`> Ready on ${protocol}://${displayHost}:${listenPort}`);
      });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });