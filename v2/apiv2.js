const fs = require("fs"); // Import File System module
const path = require("path");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const visited = new Set(); // Track visited prefixes
const filePath = path.join(__dirname, "results.txt"); // File path for storage
let requestCount = 0; // Track total API requests

// Allowed characters: "abcdefghijklmnopqrstuvwxyz0123456789"
const allowedChars = "abcdefghijklmnopqrstuvwxyz0123456789".split("");

async function saveToFile(words) {
  fs.appendFile(filePath, words.join("\n") + "\n", (err) => {
    if (err) console.error("Error writing to file:", err);
  });
}

async function fun(s) {
  if (s.length === 4 || visited.has(s)) return; // Stop if 4-char limit reached or already checked

  visited.add(s); // Mark this prefix as visited
  requestCount++; // Increment request counter

  try {
    let response = await fetch(
      `http://35.200.185.69:8000/v2/autocomplete?query=${s}`
    );
    let data = await response.json();

    console.log(`Response for "${s}":`, data);

    if (!data.results || data.results.length === 0) {
      console.log(`No words found for "${s}", skipping.`);
      return;
    }

    // Save results to the file
    await saveToFile(data.results);

    await sleep(600); // **Ensure delay before making the next request**

    // If count < 10, do not expand further
    if (data.count >= 10) {
      let lastWord = data.results[data.results.length - 1];
      let nextPrefix = lastWord.substring(0, s.length + 1);
      if (!visited.has(nextPrefix)) {
        await fun(nextPrefix);
      }
    }

    // Try expanding the prefix using allowed characters
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
  await fun(""); // Start with an empty string

  // Save summary after execution
  const summary = `\n✅ Total Requests Sent: ${requestCount}\n`;
  fs.appendFile(filePath, summary, (err) => {
    if (err) console.error("Error writing summary to file:", err);
  });

  console.log(summary);
}

// Run the function
solve();
