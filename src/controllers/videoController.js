import Video from "../models/Video";

export const home = (req, res) => {
  Video.find({}, (error, videos) => {
    // console.log("errors", error);
    // console.log("videos", videos);
    return res.render("home", { pageTitle: "Home", videos: [] });
  });
  //Video.find함수는 call back
};
export const watch = (req, res) => {
  const id = req.params.id;
  // ES6 방식 : const { id } = req.params;
  return res.render("watch", { pageTitle: `Watching` });
};
export const getEdit = (req, res) => {
  const id = req.params.id;
  return res.render("edit", { pageTitle: `Editing` });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  // console.log(req.body); // undefined -> 설정 필요 urlencoded
  const { title } = req.body;
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = (req, res) => {
  const { title } = req.body;

  const newObj = {
    title,
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: videos.length + 1,
  };
  videos.push(newObj);
  return res.redirect("/");
};
