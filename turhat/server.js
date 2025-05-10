import { WebflowClient } from "webflow-api";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import url from "url";
import { Level } from "level";
import fs from "fs/promises";

// Load environment variables from .env file
const {
WEBFLOW_CLIENT_ID,
WEBFLOW_SECRET,
PORT
NODE_ENV = "development",
} = process.env;

// Validate required environment variables
if (!WEBFLOW_CLIENT_ID || !WEBFLOW_SECRET) {
console.error(
   "Missing required environment variables. Please check your .env file:"
);
console.error("WEBFLOW_CLIENT_ID and WEBFLOW_SECRET are required");
process.exit(1);
}

// Initialize our server with basic security headers
const server = Fastify({
logger: true,
trustProxy: true, // Required for secure cookies behind a proxy
});

// Add security headers
server.addHook("onSend", async (request, reply) => {
reply.headers({
   "X-Content-Type-Options": "nosniff", // Prevent MIME type sniffing
   "X-Frame-Options": "DENY", // Prevent clickjacking
   "Strict-Transport-Security": "max-age=31536000; includeSubDomains", // Enforce HTTPS
});
});

// Initialize the database (Note: Use a proper database in production)
const db = new Level("data", { valueEncoding: "json" });
await db.open();
