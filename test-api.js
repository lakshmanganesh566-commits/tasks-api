// ------------------------------------------------------------
// Quick test script for the Notes API
// Uses only Node's built-in http module, so it works on any version.
// Usage: start the server (npm start) in one terminal,
//        then run `node test-api.js` in another terminal.
// ------------------------------------------------------------

const http = require("http");

// Send an HTTP request and resolve with { status, body }
function request(method, path, data) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;

    const req = http.request(
      {
        hostname: "localhost",
        port: 3000,
        path: path,
        method: method,
        headers: payload
          ? {
              "Content-Type": "application/json",
              "Content-Length": Buffer.byteLength(payload),
            }
          : {},
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          let body = raw;
          try {
            body = JSON.parse(raw);
          } catch (e) {
            // not JSON, keep the raw text
          }
          resolve({ status: res.statusCode, body: body });
        });
      }
    );

    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// Print a result in a readable way
function show(label, result) {
  console.log("\n=== " + label + " ===");
  console.log("Status:", result.status);
  console.log(JSON.stringify(result.body, null, 2));
}

async function run() {
  // 1. CREATE two notes
  const first = await request("POST", "/notes", {
    title: "Buy milk",
    content: "2 litres",
  });
  show("POST /notes (create first note)", first);

  const second = await request("POST", "/notes", {
    title: "Study Node.js",
    content: "Finish REST API task",
  });
  show("POST /notes (create second note)", second);

  // 2. READ all notes
  show("GET /notes (all notes)", await request("GET", "/notes"));

  // 3. READ one note
  show(
    "GET /notes/" + first.body.id + " (one note)",
    await request("GET", "/notes/" + first.body.id)
  );

  // 4. UPDATE the first note
  show(
    "PUT /notes/" + first.body.id + " (update)",
    await request("PUT", "/notes/" + first.body.id, { content: "3 litres" })
  );

  // 5. DELETE the second note
  show(
    "DELETE /notes/" + second.body.id + " (delete)",
    await request("DELETE", "/notes/" + second.body.id)
  );

  // 6. Final list
  show("GET /notes (final list)", await request("GET", "/notes"));
}

run().catch((err) => {
  console.error("Test failed. Is the server running on port 3000?");
  console.error(err.message);
});
