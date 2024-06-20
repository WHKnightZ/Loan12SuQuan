import * as esbuild from "esbuild";

const ctx = await esbuild.context({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outfile: "static/js/index.js",
  footer: {
    js: `
// Reloading browser when The code is updated
new EventSource("/esbuild").addEventListener("change", () => {
  location.reload();
});
    `,
  },
});

await ctx.watch();

const { port } = await ctx.serve({
  servedir: "/",
  port: 3000,
});

console.log("\x1b[36m%s\x1b[0m", `Local: http://127.0.0.1:${port}/`);
