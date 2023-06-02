import express from "express";

import { getBookByGenre, getBookByGenreAndPublisher, getFeaturedBooks, updateBookPriceToInteger } from "./user.controller";

const router = express.Router();

//book by genre
router.get("/genre/:genre", getBookByGenre);

router.get("/genre/:genre/publisher/:publisher", getBookByGenreAndPublisher);

router.get("/update-price", updateBookPriceToInteger);

router.get("/featured-books", getFeaturedBooks);

export default router;
