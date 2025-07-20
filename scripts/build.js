const fs = require("fs");
const { execSync } = require("child_process");

// 1. Clean dist folder
if (fs.existsSync("dist")) {
  fs.rmSync("dist", { recursive: true, force: true });
}

// 2. Run TypeScript compiler
execSync("tsc", { stdio: "inherit" });

// 3. Ensure styles directory exists
fs.mkdirSync("dist/styles", { recursive: true });

// 4. Copy globals.css
fs.copyFileSync("src/styles/globals.css", "dist/styles/globals.css");

console.log("✅ Build completed");
