import { Book } from 'Books/Book/Book.class';
import { IBookStore } from './Book-store.interface';
import { BookStoreItem } from './BookStoreItem.type';
import { User } from '../../Users/User/User.class'
import { BookStoreError } from './Book-store.exception.js';

export class BookStore implements IBookStore {
  private static instance: BookStore | null = null;
  private readonly books: Map<string, BookStoreItem> = new Map();

  private constructor() {}

  public static getInstance(): BookStore {
    if (BookStore.instance) return BookStore.instance;
    return (BookStore.instance = new BookStore());
  }

  public static resetInstance(): void {
    BookStore.instance = null;
  }

  public addBook(book: Book): BookStoreItem {
    if (this.books.get(book.uuid))
      throw new BookStoreError(
        "This book uuid has already been in our system. Couldn't add it again!",
        { book }
      );
    this.books.set(book.uuid, { book, user: null });
    return { book, user: null };
  }

  public connectOrDisconnectBook(bookUuid: string, user: User | null): boolean {
    const BookStoreItem: BookStoreItem | undefined = this.books.get(bookUuid);
    if (!BookStoreItem)
      throw new BookStoreError(
        'BookStore item not found! Cannon connect the user to the book.',
        { uuid: bookUuid, user }
      );
    this.books.set(bookUuid, { ...BookStoreItem, user });
    return true;
  }

  public getItemById(uuid: string): BookStoreItem {
    const foundItem = this.books.get(uuid);
    if (!foundItem)
      throw new BookStoreError('Passed book uuid not found.', { uuid });
    return foundItem;
  }

  public removeItemById(uuid: string): BookStoreItem {
    const itemToRm = this.books.get(uuid);
    if (!itemToRm)
      throw new BookStoreError(
        "Passed book uuid not found. Couldn't remove the book!",
        { uuid }
      );
    if (itemToRm.user)
      throw new BookStoreError(
        'This book has already been booked. Removing possible after returnement.',
        { uuid }
      );
    this.books.delete(uuid);
    return itemToRm;
  }
}
