import { Book } from 'Book/Book.class';
import { ILibrary } from './Library.interface';
import { LibraryItem } from './LibraryItem.type';
import { User } from '../Users/User.class';
import { LibraryError } from './Library.exception';

// TODO czy praktyruje się zapisywanie informacji w 2 miejscach, czyli w systemie wypożyczeń, że dany użytkownik pożyczył daną książkę ORAZ podpięcie tegoż użytkownika do książki równoczęsnie. Cel -> ułatwienie wyszukiwania wolnych książek czy od razu sprawdzenie, że dana wyszukana książka jest zajęta. Inaczej chcąc sprawdzić czy dana książka jest wypożyczona trzebaby w systemie wypożyczeń sprawdzić czy występuje w powiązaniach książka - użytkownik a biorąc pod uwagę, że każdy użytkowni może mieć wiele książek to query byłoby obciążające...

export class Library implements ILibrary {
  private static instance: Library | null = null;
  private static books: Map<string, LibraryItem> = new Map();

  private constructor() {}

  public static getLibrary(): Library {
    if (Library.instance) return Library.instance;
    return (Library.instance = new Library());
  }

  public addBook(book: Book): LibraryItem | void {
    if (this.getItemById(book.uuid))
      throw new LibraryError(
        "This book uuid has already been in our system. Couldn't add it again!",
        500
      );
    Library.books.set(book.uuid, { book, user: null });
    return { book, user: null };
  }

  public connectBookWhUser(
    bookUuid: string,
    user: User | null
  ): boolean | void {
    const libraryItem: LibraryItem | undefined = Library.books.get(bookUuid);
    if (!libraryItem)
      throw new LibraryError(
        'Library item not found! Cannon connect the user to the book.',
        500
      );
    Library.books.set(bookUuid, { ...libraryItem, user });
  }

  public getItemById(uuid: string): LibraryItem | undefined {
    return Library.books.get(uuid);
  }

  public removeBookById(uuid: string): LibraryItem | void {
    const bookToRm = this.getItemById(uuid);
    if (!bookToRm)
      throw new LibraryError(
        "Passed book uuid not found. Couldn't remove the book!",
        500
      );
    if (bookToRm.user)
      throw new LibraryError(
        'This book has already been booked. Removing possible after returnement.',
        500
      );
    Library.books.delete(uuid);
    return bookToRm;
  }
}
