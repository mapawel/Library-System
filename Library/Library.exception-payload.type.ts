import { User } from "../Users/User.class";
import { Book } from "../Book/Book.class";

export type ExceptionPayload = {
  uuid?: string;
  book?: Book
  user?: User | null
};
