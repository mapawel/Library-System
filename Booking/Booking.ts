import { Book } from '../Book/Book';
import { v4 as uuidv4 } from 'uuid';

export class Booking {
  readonly uuid: string;
  private book: Book;
  private bookingDays: Date;

  constructor(book: Book, bookingDays: number = 7) {
    this.uuid = uuidv4();
    this.book = book;
    this.bookingDays = new Date(Date.now() + bookingDays * 1000 * 3600 * 24);
  }
}
