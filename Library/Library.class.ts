import { Book } from 'Book/Book.class';
import { ILibrary } from './Library.interface';
import { LibraryItem } from './LibraryItem.type';
import { User } from '../Users/User.class';
import { LibraryError } from './Library.exception';

export class Library implements ILibrary {
  private static instance: Library | null = null;
  private readonly books: Map<string, LibraryItem> = new Map();

  private constructor() {}

  public static getInstance(): Library {
    if (Library.instance) return Library.instance;
    return (Library.instance = new Library());
  }

  public addBook(book: Book): LibraryItem | void {
    if (this.getItemById(book.uuid))
      throw new LibraryError(
        "This book uuid has already been in our system. Couldn't add it again!"
      );
    this.books.set(book.uuid, { book, user: null });
    return { book, user: null };
  }

  public connectBookWhUser(
    bookUuid: string,
    user: User | null
  ): boolean | void {
    const libraryItem: LibraryItem | undefined = this.books.get(bookUuid);
    if (!libraryItem)
      throw new LibraryError(
        'Library item not found! Cannon connect the user to the book.'
      );
    this.books.set(bookUuid, { ...libraryItem, user });
  }

  public getItemById(uuid: string): LibraryItem | undefined {
    return this.books.get(uuid);
  }

  public removeBookById(uuid: string): LibraryItem | void {
    const bookToRm = this.getItemById(uuid);
    if (!bookToRm)
      throw new LibraryError(
        "Passed book uuid not found. Couldn't remove the book!"
      );
    if (bookToRm.user)
      throw new LibraryError(
        'This book has already been booked. Removing possible after returnement.'
      );
    this.books.delete(uuid);
    return bookToRm;
  }
}
