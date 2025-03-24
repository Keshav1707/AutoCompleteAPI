const fs = require("fs"); // Import File System module
const path = require("path");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const visited = new Set(); //visited prefixes
const filePath = path.join(__dirname, "results.txt"); // File path for storage
let requestCount = 0; //total requests

async function saveToFile(words) {
  fs.appendFile(filePath, words.join("\n") + "\n", (err) => {
    if (err) console.error("Error writing to file:", err);
  });
}

async function fun(s) {
  if (s.length === 4 || visited.has(s)) return; // Stop if already checked

  visited.add(s); // mark this prefix as visited
  requestCount++; //req counter

  try {
    let response = await fetch(
      `http://35.200.185.69:8000/v1/autocomplete?query=${s}`
    );
    let data = await response.json();

    console.log(`Response for ${s}:`, data);

    if (!data.results || data.results.length === 0) {
      console.log(`No words found for ${s}, skipping to next prefix.`);
      return;
    }

    // Save results to the file
    await saveToFile(data.results);

    await sleep(600); // **Ensure delay before making the next request**

    // If count < 10, do not move further, just move lexicographically
    if (data.count < 10) {
      console.log(`Skipping further expansion for ${s} as count < 10.`);
    } else {
      let lastWord = data.results[data.results.length - 1];
      let nextPrefix = lastWord.substring(0, s.length + 1);
      if (!visited.has(nextPrefix)) {
        await fun(nextPrefix);
      }
    }

    // Move to the next prefix
    let lastChar = s[s.length - 1];
    for (let c = lastChar.charCodeAt(0) + 1; c <= 122; c++) {
      let newPrefix = s.slice(0, -1) + String.fromCharCode(c);
      if (!visited.has(newPrefix)) {
        console.log(`Trying next prefix: ${newPrefix}`);
        await sleep(600); // **Delay before checking the next prefix**
        await fun(newPrefix);
      }
    }
  } catch (error) {
    console.error(`Error fetching data for ${s}:`, error);
  }
}

async function solve() {
  let s = "a";
  await fun(s);

  // 🔹 After execution, save summary to file
  const summary = `\n Total Requests Sent: ${requestCount}\n`;
  fs.appendFile(filePath, summary, (err) => {
    if (err) console.error("Error writing summary to file:", err);
  });

  console.log(summary);
}

// Run the function
solve();
