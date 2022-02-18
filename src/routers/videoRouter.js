import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
} from "../controllers/videoController";

const videoRouter = express.Router();

// parameters (순서 중요!)

videoRouter.get("/:id([0-9a-f]{24})", watch);
// :id -> variable
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
// videoRouter.post("/:id(\\d+)/edit", postEdit);
// videoRouter.get("/:id(\\d+)/edit", getEdit);
videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter;
