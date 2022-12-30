import { Book } from 'Library/Book/Book.class';
import { ILibrary } from './Library.interface';
import { LibraryItem } from './LibraryItem.type';
import { User } from '../Users/User.class';
import { LibraryError } from './Library.exception.js';

export class Library implements ILibrary {
  private static instance: Library | null = null;
  private readonly books: Map<string, LibraryItem> = new Map();

  private constructor() {}

  public static getInstance(): Library {
    if (Library.instance) return Library.instance;
    return (Library.instance = new Library());
  }

  public static resetInstance(): void {
    Library.instance = null;
  }

  public addBook(book: Book): LibraryItem {
    if (this.books.get(book.uuid))
      throw new LibraryError(
        "This book uuid has already been in our system. Couldn't add it again!",
        { book }
      );
    this.books.set(book.uuid, { book, user: null });
    return { book, user: null };
  }

  public connectBookWhUser(bookUuid: string, user: User | null): boolean {
    const libraryItem: LibraryItem | undefined = this.books.get(bookUuid);
    if (!libraryItem)
      throw new LibraryError(
        'Library item not found! Cannon connect the user to the book.',
        { uuid: bookUuid, user }
      );
    this.books.set(bookUuid, { ...libraryItem, user });
    return true;
  }

  public getItemById(uuid: string): LibraryItem {
    const foundItem = this.books.get(uuid);
    if (!foundItem)
      throw new LibraryError('Passed book uuid not found.', { uuid });
    return foundItem;
  }

  public removeItemById(uuid: string): LibraryItem {
    const itemToRm = this.books.get(uuid);
    if (!itemToRm)
      throw new LibraryError(
        "Passed book uuid not found. Couldn't remove the book!",
        { uuid }
      );
    if (itemToRm.user)
      throw new LibraryError(
        'This book has already been booked. Removing possible after returnement.',
        { uuid }
      );
    this.books.delete(uuid);
    return itemToRm;
  }
}
