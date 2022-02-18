import mongoose from "mongoose";

// model에서는 형식과 형태를 지정해준다.
// 배열과 객체, 일반 자료형 모두 선언가능
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true }, // == title: String,
  description: { type: String, required: true, trim: true },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

// 예시.
// const video = {
//   title: "this is title",
//   description: "lalalala",
//   createdAt: 12121212,
//   hashtags: ["#hi", "#mongo"],
// };

const Video = mongoose.model("Video", videoSchema);
export default Video;
