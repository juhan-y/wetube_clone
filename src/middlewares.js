import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  // 로그인을 안한 상태라면 req.session.user는 undefined인데
  // "|| {}" 없이 그냥 넘겨주면 pug에서 undefined로 인한 오류가 발생함!
  // 이 때문에 아래의 protectMiddleware가 발동되지 않으므로
  // "|| {}"를 작성한 것!
  console.log(res.locals);
  next(); // next를 해야 다음 app.use나 app.get이 실행될 수 있음!
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Log in first.");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: { fileSize: 3000000 },
});

export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: { fileSize: 10000000 },
});
