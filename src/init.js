import "regenerator-runtime";
import "dotenv/config";
// process.env에 .env파일이 적용될 수 있게 한다.
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const handleListening = () =>
  console.log(
    `✅ Server listening on port http://localhost:${
      process.env.PORT || 4000
    } 🚀`
  );

app.listen(process.env.PORT || 4000, handleListening);
