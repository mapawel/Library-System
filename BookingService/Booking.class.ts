import { Book } from '../Book/Book.class';
import { v4 as uuidv4 } from 'uuid';

export class Booking {
  readonly uuid: string;
  readonly book: Book;
  readonly endDate: Date;

  constructor(book: Book, bookingDays: number = 7) {
    this.uuid = uuidv4();
    this.book = book;
    this.endDate = new Date(Date.now() + bookingDays * 1000 * 3600 * 24);
  }
}
