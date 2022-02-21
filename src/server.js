import express from "express";
import morgan from "morgan";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import MongoStore from "connect-mongo";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const loggerMiddleware = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(loggerMiddleware);
app.use(express.urlencoded({ extended: true }));
// form value를 express application이 이해하도록 하는 설정

app.use(
  session({
    secret: "Hello!",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/wetube" }),
    // session 저장 default -> mongoDB로 변경.
  })
);

app.use(localsMiddleware);
// 반드시 sessionStore 뒤에 위치 해야함!
// 그렇지 않으면 실행안됨!

app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const privateMiddleware = (req, res, next) => {
  const url = req.url;
  if (url === "/protected") {
    return res.send("<h1>Not Allowed</h1>");
  }
  console.log("Allowed, you may continue.");
  next();
};

export default app;
