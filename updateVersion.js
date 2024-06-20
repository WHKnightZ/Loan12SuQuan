const fs = require("fs");

fs.readFile("src/configs/version.json", (err, content) => {
  if (err) throw err;

  const metadata = content.toString().replace(/"/g, "").split(".");
  metadata[1] = Number(metadata[1]) + 1;

  fs.writeFile("src/configs/version.json", `"${metadata.join(".")}"`, () => {});
});
