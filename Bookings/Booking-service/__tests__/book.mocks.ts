import { Book } from '../../../Books/Book/Book.class';

export const bookMock: Book = new Book({
  title: 'Example Title',
  author: 'Example Author',
  year: 1990,
  publisher: 'Example Publisher',
});

export const book2Mock: Book = new Book({
  title: 'Example Title 222',
  author: 'Example Author 222',
  year: 1992,
  publisher: 'Example Publisher 222',
});
