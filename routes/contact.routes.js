import { Router } from "express";
import {
  submitQuery,
  seenMessage,
  getAllQueries,
  deleteQuery,
  getRangeQueries,
} from "../controllers/contact.controller.js";

const router = Router();

router.route("/submitQuery").post(submitQuery);
router.route("/seenMessage").post(seenMessage);
router.route("/getAllQueries").get(getAllQueries);
router.route("/deleteQuery").post(deleteQuery);
router.route("/getRangeQueries").get(getRangeQueries);

export default router;
