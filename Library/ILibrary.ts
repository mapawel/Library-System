import { Book } from '../Book/Book';
import { LibraryItem } from './LibraryItemType';

export interface ILibrary {
  addBook(book: Book): LibraryItem | void;
  getItemById(uuid: string): LibraryItem | undefined;
}
