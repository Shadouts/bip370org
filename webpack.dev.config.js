const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  target: "web",
  watch: true,
  entry: "./src/index.tsx",
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
    extensions: [".tsx", ".ts", ".js"],
    fallback: { stream: require.resolve("stream-browserify") },
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./"),
  },
  plugins: [
    // Work around for Buffer is undefined:
    // https://github.com/webpack/changelog-v5/issues/10
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ],
};
