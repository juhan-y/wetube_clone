import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
  deleteVideo,
} from "../controllers/videoController";
import { protectorMiddleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();

// parameters (순서 중요!)

videoRouter.get("/:id([0-9a-f]{24})", watch);
// :id -> variable
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
// videoRouter.post("/:id(\\d+)/edit", postEdit);
// videoRouter.get("/:id(\\d+)/edit", getEdit);
videoRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectorMiddleware)
  .get(deleteVideo);
videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(videoUpload.fields([{ name: "video" }, { name: "thumb" }]), postUpload);
export default videoRouter;
