import express from "express";
import {
  watch,
  edit,
  upload,
  deleteVideo,
} from "../controllers/videoController";

const videoRouter = express.Router();

// parameters (순서 중요!)
videoRouter.get("/upload", upload);
videoRouter.get("/:id(\\d+)", watch);
// :id -> variable
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);

export default videoRouter;
