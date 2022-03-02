import express from "express";
import morgan from "morgan";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import MongoStore from "connect-mongo";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";

const app = express();
const loggerMiddleware = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(loggerMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRouter);
// form value를 express application이 이해하도록 하는 설정

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false, // 수정되지 않은 session을 저장할 것인가.
    // -> false를 통해 login한 user(즉, userController에서)
    // postLogin controller를 거친 user만 session 저장됨.
    cookie: {
      maxAge: 20000,
    },

    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
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
