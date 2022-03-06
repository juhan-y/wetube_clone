import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";
// Video는 default export지만 formatHashtags는 default가 아님
// 표기에 유의

// Video.find({}, (error, videos) => {
//   // console.log("errors", error);
//   // console.log("videos", videos);
//   return res.render("home", { pageTitle: "Home", videos: [] });
// });
export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner"); // 여기서 javascript가 database를 기다려줌
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (video === null) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video });

  // ES6 방식 : const { id } = req.params;
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the owner of the video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  // another way to update data.
  // const video = await Video.findById(id);
  // if (video === null) {
  //   return res.render("404", { pageTitle: "Video not found." });
  // }
  // video.title = title;
  // video.description = description;
  // video.hashtags = hashtags
  //   .split(",")
  //   .map((word) => (word.startsWith("#") ? word : `#${word}`));
  // video.save();
  req.flash("success", "Changes saved");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: video[0].path,
      thumbUrl: thumb[0].destination + thumb[0].filename,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
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

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  const user = await User.findById(_id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  user.videos.splice(user.videos.indexOf(id), 1);
  user.save();
  return res.redirect("/");
};

export const search = async (req, res) => {
  // console.log(req.query); //get method 사용할 때 url에서 "?"뒤를 object로 가져옴.
  const { keyword } = req.query;
  let videos = [];
  // search 페이지에 처음 들어왔을 때도 살행은 되나 req.query에는 아무것도 없다.
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}`, "i"), // i-> 대문자 소문자 구분 무시
        // $regex: new RegExp(`^${keyword}`, "i"), -> starts only
        // $regex: new RegExp(`${keyword}$`, "i"), -> endswith only
        // $gt: 3, // greater than 3
      },
    }).populate("owner");
    return res.render("search", { pageTitle: "Search", videos });
  }
  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;

  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  await video.comments.push(comment._id);
  await video.save();
  console.log("Create Comment!");
  return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    params: { commentId },
  } = req;

  const comment = await Comment.findById(commentId).populate("owner");
  const videoId = comment.video;
  if (String(_id) !== String(comment.owner._id)) {
    return res.sendStatus(404);
  }
  const video = await Video.findById(videoId);
  if (!video) {
    return res.sendStatus(404);
  }

  video.comments.splice(video.comments.indexOf(commentId), 1);
  await video.save();
  await Comment.findByIdAndDelete(commentId);

  return res.sendStatus(200);
};
