interface IBook {
  title: string;
  author: string;
  genre: string;
  publicationYear: number;
  rating: number;
  price: number;
  publisher: {
    name: string;
    location: string;
  };
  reviews: {
    reviewer: string;
    comment: string;
  }[];
}

export default IBook;
