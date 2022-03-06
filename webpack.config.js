const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require("path");

const BASE_JS = "./src/client/js/";

// console.log(path.resolve(__dirname, "assets", "js"));
module.exports = {
  entry: {
    main: BASE_JS + "main.js",
    videoPlayer: BASE_JS + "videoPlayer.js",
    recorder: BASE_JS + "recorder.js",
    commentSection: BASE_JS + "commentSection.js",
  }, // file we want to transform!, 즉 사용할 파일
  mode: "development",
  watch: true,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"), // 상대경로 입력하면 오류!
    // 하지만 우리는 전체(절대)경로를 입력하기 귀찮다!
    // -> path library 사용!
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        // webpack은 뒤부터 loader를 실행한다. 그러므로 loader를 역순으로 배치함.
      },
    ],
  },
};
