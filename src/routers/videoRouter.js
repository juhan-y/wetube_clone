import express from "express";
import { watch, getEdit, postEdit } from "../controllers/videoController";

const videoRouter = express.Router();

// parameters (순서 중요!)

videoRouter.get("/:id(\\d+)", watch);
// :id -> variable
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);
// videoRouter.post("/:id(\\d+)/edit", postEdit);
// videoRouter.get("/:id(\\d+)/edit", getEdit);

export default videoRouter;
