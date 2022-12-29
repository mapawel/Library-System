import { LibraryItem } from "../Library/LibraryItem.type";
import { User } from "../Users/User.class";

export type ExceptionPayload = {
  user: User;
  libraryItem: LibraryItem
};
