```
2. http://localhost:5000/api/v1/book/genre/Fantasy
3.http://localhost:5000/api/v1/book/genre/Mystery/publisher/Publisher%20A
4.http://localhost:5000/api/v1/book/featured-books
5.http://localhost:5000/api/v1/book/update-price

```

## Question 1: What is the purpose of creating a model with an interface and schema in MongoDB? How does it help in defining the structure of a collection?

```
the purpose of creating a model with an interface and schema in MongoDB for several purposes like data validation, type checking, readability
```

## Question 2: Explain the concept of field filtering in MongoDB. How can you specify which fields to include or exclude in the returned documents?

```
We can specify which fields to include or exclude through projection.
```

## Question 3: What are instance methods in MongoDB models? Provide an example of a custom instance method and explain its purpose.

```
Instance method in MongoDB is custom method defined on individual instances of a model. These methods can be accessed and invoked on a specific document retrieved from the database.

bookSchema.methods.getPriceWithTax = function () {
  const price = this.get('price');
  const taxRate = 0.1; // Assuming 10% tax rate
  const totalPrice = price + (price * taxRate);
  return totalPrice;
};

the purpose of this method is to get price of a book with tax.

```

## Question 4: How do you use comparison operators like "$ne," "$gt," "$lt," "$gte," and "$lte" in MongoDB queries? Provide examples to illustrate their usage.

```
Book.find({age: {$gt: 18}});
Book.aggregate([ { $match: { rating: { $gte: 4 } } }])

```

## Question 5: What are MongoDB’s “$in” and “$nin” operators? How can you use them to match values against an array of values or exclude values from a given array?

```
In MongoDB, the "$in" and "$nin" operators are used to match values against an array of values.

Book.find({author: {$nin: ['Author 1', 'Author 2']}}) // retrieve all book which author should not "Author 1" and "Author 2"

Book.find({author: {$in: ['Author 1', 'Author 2']}}) // retrieve all book which author should be "Author 1" and "Author 2"

```
