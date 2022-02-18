import Video from "../models/Video";

// Video.find({}, (error, videos) => {
//   // console.log("errors", error);
//   // console.log("videos", videos);
//   return res.render("home", { pageTitle: "Home", videos: [] });
// });
export const home = async (req, res) => {
  const videos = await Video.find({}); // 여기서 javascript가 database를 기다려줌
  return res.render("home", { pageTitle: "Home", videos });
};
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  console.log(video);
  // ES6 방식 : const { id } = req.params;
  return res.render("watch", { pageTitle: video.title, video });
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

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }

  // 2번째 방법
  // const video = new Video({
  //   title,
  //   description,
  //   createdAt: Date.now(),
  //   hashtags: hashtags.split(",").map((word) => `#${word}`),
  //   meta: {
  //     views: 0,
  //     rating: 0,
  //   },
  // })
  // const dbVideo = await video.save();
};
