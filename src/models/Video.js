import mongoose from "mongoose";

// export const formatHashtags = (hashtags) =>
//   hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));

// model에서는 형식과 형태를 지정해준다.
// 배열과 객체, 일반 자료형 모두 선언가능
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 80 }, // == title: String,
  fileUrl: { type: String, required: true },
  thumbUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, minlength: 20 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

// middleware는 반드시 model이 해당 모델이 생성되기 전에 만들어져야한다!!
// videoSchema.pre("save", async function () {
//   this.hashtags = this.hashtags[0]
//     .split(",")
//     .map((word) => (word.startsWith("#") ? word : `#${word}`));
// });

// 예시.
// const video = {
//   title: "this is title",
//   description: "lalalala",
//   createdAt: 12121212,
//   hashtags: ["#hi", "#mongo"],
// };

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});
// static으로 formatHashtags 함수를 만들면 Video를 import해도
// formatHashtags 함수도 딸려온다.

const Video = mongoose.model("Video", videoSchema);
export default Video;
