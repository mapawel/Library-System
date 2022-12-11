import { Book } from 'Book/Book';
import { ILibrary } from './ILibrary';
import { LibraryItem } from './LibraryItemType';
// TODO czy praktyruje się zapisywanie stanu w 2 miejscach, czyli w systemie wypożyczeć, że dany użytkownik pożyczył daną książkę ORAZ podpięcie tegoż użytkownika do książki równoczęsnie. Cel -> ułatwienie wyszukiwania wolnych książek czy od razu sprawdzenie, że dana wyszukana książka jest zajęta. Inaczej chcąc sprawdzić czy dana książka jest wypożyczona trzebaby w systemie wypożyczeń sprawdzić czy występuje w powiązaniach książka - użytkownik a biorąc pod uwagę, że każdy użytkowni może mieć wiele książek to query byłoby obciążające...

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
      throw new Error(
        "This book uuid has already been in our system. Couldn't add it again!"
      );
    Library.books.set(book.uuid, { book, user: null });
    return { book, user: null };
  }

  public removeBookById(uuid: string): LibraryItem | void {
    const bookToRm = this.getItemById(uuid);
    if (!bookToRm)
      throw new Error("Passed book uuid not found. Couldn't remove the book!");
    if (bookToRm.user)
      throw new Error(
        'This book has already been booked. Removing possible after returnement.'
      );
    Library.books.delete(uuid);
    return bookToRm;
  }

  public getItemById(uuid: string): LibraryItem | undefined {
    return Library.books.get(uuid);
  }

  // public getBooks(): Map<string, LibraryItem> {
  //   return new Map(Library.books);
  // }
}
