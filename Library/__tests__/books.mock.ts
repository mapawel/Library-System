import { Book } from "../../Books/Book/Book.class";

export const bookMock: Book = new Book({
  title: 'Example Title',
  author: 'Example Author',
  year: 1990,
  publisher: 'Example Publisher',
});

export const book2Mock: Book = new Book({
  title: 'Example Title2',
  author: 'Example Author2',
  year: 1992,
  publisher: 'Example Publisher2',
});
