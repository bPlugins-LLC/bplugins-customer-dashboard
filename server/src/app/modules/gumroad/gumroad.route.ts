import express from "express";

import { getBookByGenre, getBookByGenreAndPublisher, getFeaturedBooks, updateBookPriceToInteger } from "./gumroad.controller";

const router = express.Router();

//book by genre
router.get("/");

export default router;
