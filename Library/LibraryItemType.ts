import { Book } from "Book/Book"
import { UserStoreItem } from "../Users/UserStore/UserStoreItemType";

export type LibraryItem = {
  book: Book;
  user: UserStoreItem | null
}