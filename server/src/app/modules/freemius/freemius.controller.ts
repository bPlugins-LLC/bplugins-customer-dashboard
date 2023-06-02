import { Response, Request } from "express";
import Book from "./freemius.model";

//task 2
export const getBookByGenre = async (req: Request, res: Response) => {
  const { genre } = req.params;

  const books = await Book.find({ genre });

  res.json({
    status: "success",
    data: books,
  });
};

// task 3
export const getBookByGenreAndPublisher = async (req: Request, res: Response) => {
  const { genre, publisher } = req.params;

  const books = await Book.find({ genre, "publisher.name": publisher });

  res.json({
    status: "success",
    data: books,
  });
};

// task 4
export const getFeaturedBooks = async (req: Request, res: Response) => {
  const books = await Book.aggregate([
    { $match: { rating: { $gte: 4 } } },
    {
      $addFields: {
        featured: {
          $cond: {
            if: { $gte: ["$rating", 4.5] },
            then: "BestSeller",
            else: "Popular",
          },
        },
      },
    },
    // { $project: { rating: true, featured: true } },
  ]);

  res.json({
    status: "success",
    data: books,
  });
};

// task 5
export const updateBookPriceToInteger = async (req: Request, res: Response) => {
  const books = await Book.updateMany({ publicationYear: { $gt: 2020 }, price: { $type: "string" } }, [{ $set: { price: { $toInt: "$price" } } }]);

  res.json({
    status: "success",
    data: books,
  });
};
