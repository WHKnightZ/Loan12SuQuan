const path = require("path");

module.exports = {
  entry: ["./src/index.ts"],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".html"],
    alias: {
      "@": path.resolve(__dirname, "./src/"),
    },
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "static/js"),
  },
  devServer: {
    static: {
      directory: "./",
    },
    compress: true,
    port: 3000,
    devMiddleware: {
      writeToDisk: (filePath) => {
        return !/hot-update/i.test(filePath);
      },
    },
  },
};
