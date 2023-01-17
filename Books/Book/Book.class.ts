import { v4 as uuidv4 } from 'uuid';
import { BookParams } from '../Books.types';

export class Book {
  readonly uuid: string;
  private readonly title: string;
  private readonly author: string;
  private readonly year: number;
  private readonly publisher: string;

  constructor({ title, author, year, publisher }: BookParams) {
    // VALIDATORS WILL BE ADD HERE TO VALIDATE TITLE, AUTHOR, YEAR, PUBLISHER!
    this.uuid = uuidv4();
    this.title = title;
    this.author = author;
    this.year = year;
    this.publisher = publisher;
  }
}
