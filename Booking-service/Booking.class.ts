import { Book } from '../Library/Book/Book.class';
import { v4 as uuidv4 } from 'uuid';
import { daysToMillis } from '../utils/daysToMillis';

export class Booking {
  readonly uuid: string;
  readonly book: Book;
  readonly endDate: Date;

  constructor(book: Book, bookingDays: number = 7) {
    this.uuid = uuidv4();
    this.book = book;
    this.endDate = new Date(Date.now() + daysToMillis(bookingDays));
  }
}
