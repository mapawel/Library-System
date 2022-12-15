import { v4 as uuidv4 } from 'uuid';
import { BookProps } from './BookPropsType';

export class Book {
  readonly uuid: string;
  private title: string;
  private author: string;
  private year: number;
  private publisher: string;

  constructor({ title, author, year, publisher }: BookProps) {
    // VALIDATORS WILL BE ADD HERE TO VALIDATE TITLE, AUTHOR, YEAR, PUBLISHER!
    this.uuid = uuidv4();
    this.title = title;
    this.author = author;
    this.year = year;
    this.publisher = publisher;
  }
}
