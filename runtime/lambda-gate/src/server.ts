// SPDX-License-Identifier: Apache-2.0
// Author: Lutar, Stephen P. | ORCID 0009-0001-0110-4173 | SZL Holdings
// Module: ouroboros/lambda-gate  HTTP layer
// Doctrine V6 preflight: ✓

import http from "node:http";
import { gateTransit, getReceipt, allReceipts, verifyReceipt } from "./gate.js";

function readBody(req: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let buf = "";
    req.on("data", (c: Buffer) => { buf += c.toString(); });
    req.on("end", () => {
      try { resolve(JSON.parse(buf)); }
      catch (e) { reject(e); }
    });
    req.on("error", reject);
  });
}

export function parseVerifyHash(raw: unknown): string {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new TypeError("invalid verify request");
  }

  const fields = Object.keys(raw);
  if (fields.length !== 1 || fields[0] !== "hash") {
    throw new TypeError("invalid verify request");
  }

  const hash = (raw as Record<string, unknown>)["hash"];
  if (typeof hash !== "string" || !/^[0-9a-f]{64}$/.test(hash)) {
    throw new TypeError("invalid verify request");
  }

  return hash;
}

function send(res: http.ServerResponse, status: number, body: unknown): void {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type":   "application/json",
    "Content-Length": Buffer.byteLength(json),
  });
  res.end(json);
}

type RouteHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => void | Promise<void>;

const handleReceiptTransit: RouteHandler = async (req, res) => {
  const body = await readBody(req);
  const result = gateTransit(body);
  send(res, result.stored ? 201 : 422, result);
};

const handleReceiptList: RouteHandler = (_req, res) => {
  send(res, 200, allReceipts());
};

const handleReceiptVerify: RouteHandler = async (req, res) => {
  const hash = parseVerifyHash(await readBody(req));
  send(res, 200, verifyReceipt(hash));
};

const handleFallback: RouteHandler = (req, res) => {
  const url = req.url ?? "/";
  const method = req.method?.toUpperCase() ?? "GET";
  const hashMatch = url.match(/^\/receipts\/([0-9a-f]{64})$/);

  if (method === "GET" && hashMatch) {
    const receipt = getReceipt(hashMatch[1]);
    if (!receipt) {
      send(res, 404, { error: "not found" });
      return;
    }
    send(res, 200, receipt);
    return;
  }

  send(res, 404, { error: "not found" });
};

const EXACT_ROUTES: ReadonlyMap<string, RouteHandler> = new Map([
  ["POST /receipts", handleReceiptTransit],
  ["GET /receipts", handleReceiptList],
  ["POST /verify", handleReceiptVerify],
]);

export function createServer(): http.Server {
  return http.createServer(async (req, res) => {
    const url = req.url ?? "/";
    const method = req.method?.toUpperCase() ?? "GET";

    try {
      const handler = EXACT_ROUTES.get(`${method} ${url}`) ?? handleFallback;
      await handler(req, res);
    } catch (err) {
      // Log full error server-side for ops, but never leak details to caller (CWE-209).
      console.error("[lambda-gate] request error:", err);
      send(res, 400, { error: "bad request" });
    }
  });
}

// Entrypoint
if (process.argv[1]?.endsWith("server.js") || process.argv[1]?.endsWith("server.ts")) {
  const port = Number(process.env["PORT"] ?? 3001);
  createServer().listen(port, () => console.log(`lambda-gate listening :${port}`));
}
