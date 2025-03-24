const fs = require("fs");
const path = require("path");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchData(url) {
  const fetch = (await import("node-fetch")).default;
  return fetch(url, {
    method: "GET",
    headers: { "User-Agent": "Mozilla/5.0" },
  });
}

const visited = new Set();
const filePath = path.join(__dirname, "results.txt");

// Allowed characters: "012346789acdefghijklmnopqrstuvwxyz+.- (space)"
const allowedChars = "012346789acdefghijklmnopqrstuvwxyz+.- ".split("");

let requestCount = 0; // 🔹 Track total requests

async function saveToFile(words) {
  fs.appendFile(filePath, words.join("\n") + "\n", (err) => {
    if (err) console.error("Error writing to file:", err);
  });
}

async function fun(s) {
  if (s.length === 4 || visited.has(s)) return;

  visited.add(s);
  requestCount++; // 🔹 Increment request count

  try {
    let url = `http://35.200.185.69:8000/v3/autocomplete?query=${encodeURIComponent(
      s
    )}`;
    let response = await fetchData(url);
    let data = await response.json();

    console.log(`Response for "${s}":`, data);

    if (!data.results || data.results.length === 0) {
      console.log(`No words found for "${s}", skipping.`);
      return;
    }

    await saveToFile(data.results);
    await sleep(600);

    if (data.count >= 10) {
      let lastWord = data.results[data.results.length - 1];
      let nextPrefix = lastWord.substring(0, s.length + 1);
      if (!visited.has(nextPrefix)) {
        await fun(nextPrefix);
      }
    }

    for (let c of allowedChars) {
      let newPrefix = s + c;
      if (!visited.has(newPrefix)) {
        console.log(`Trying next prefix: "${newPrefix}"`);
        await sleep(600);
        await fun(newPrefix);
      }
    }
  } catch (error) {
    console.error(`Error fetching data for "${s}":`, error);
  }
}

async function solve() {
  await fun("");

  // 🔹 After execution, save summary to file
  const summary = `\n✅ Total Requests Sent: ${requestCount}\n`;
  fs.appendFile(filePath, summary, (err) => {
    if (err) console.error("Error writing summary to file:", err);
  });

  console.log(summary);
}

solve();
