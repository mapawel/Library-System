import { assert } from 'chai';
import { BookStore } from '../Book-store/Book-store';
import { User } from '../../Users/User/User.class';
import { bookMock } from './book.mock';
import type { BookStoreItem } from '../Book-store/BookStoreItem.type';
import { userMock } from './user.mock';

describe('BookStore tests suite:', () => {
  let library: BookStore;
  beforeEach(() => {
    library = BookStore.getInstance();
  });
  afterEach(() => {
    BookStore.resetInstance();
  });

  describe('addBook() tests:', () => {
    it('should add a book to field book in library item object', () => {
      const bookStoreItem: BookStoreItem = library.addBook(bookMock);
      assert.deepEqual(bookStoreItem.book, bookMock);
    });

    it('should create field user with value of null for new added book', () => {
      const bookStoreItem: BookStoreItem = library.addBook(bookMock);
      assert.isNull(bookStoreItem.user);
    });

    it('should throw error while adding a book with the same uuid', () => {
      assert.throws(() => {
        library.addBook(bookMock);
        library.addBook(bookMock);
      }, "This book uuid has already been in our system. Couldn't add it again!");
    });
  });

  describe('getItemById() tests:', () => {
    it('should return a library item by uuid', () => {
      const bookStoreItem: BookStoreItem = library.addBook(bookMock);
      const foundLibraryItem = library.getItemById(bookStoreItem.book.uuid);
      assert.deepEqual(bookStoreItem, foundLibraryItem);
    });

    it('should throw error while getting by unexisting uuid', () => {
      assert.throws(() => {
        library.getItemById('nonExistingId');
      }, 'Passed book uuid not found.');
    });
  });

  describe('removeItemById() tests:', () => {
    it('should remove library item with specyfic uuid and  error on try of getting removed item', () => {
      const bookStoreItem: BookStoreItem = library.addBook(bookMock);
      assert.deepEqual(bookStoreItem, library.getItemById(bookStoreItem.book.uuid));
      library.removeItemById(bookStoreItem.book.uuid);
      assert.throws(() => {
        library.getItemById(bookStoreItem.book.uuid);
      }, 'Passed book uuid not found.');
    });

    it('should throw error on try to remove non existing item', () => {
      assert.throws(() => {
        library.removeItemById('nonExistingId');
      }, "Passed book uuid not found. Couldn't remove the book!");
    });

    it('should throw error on try to remove which is booked', () => {
      const bookStoreItem: BookStoreItem = library.addBook(bookMock);
      const user: User = new User(userMock);
      assert.deepEqual(bookStoreItem, library.getItemById(bookStoreItem.book.uuid));
      library.connectOrDisconnectBook(bookStoreItem.book.uuid, user);
      assert.throws(() => {
        library.removeItemById(bookStoreItem.book.uuid);
      }, 'This book has already been booked. Removing possible after returnement.');
    });
  });

  describe('connectOrDisconnectBook() tests:', () => {
    it('should connect specyfic user to user field of library item', () => {
      const addedLibraryItem: BookStoreItem = library.addBook(bookMock);
      const user: User = new User(userMock);
      library.connectOrDisconnectBook(addedLibraryItem.book.uuid, user);
      const bookStoreItem: BookStoreItem = library.getItemById(
        addedLibraryItem.book.uuid
      );
      assert.deepEqual(bookStoreItem.user, user);
    });

    it('should throw error on try to connect non existing library item with user', () => {
      const user: User = new User(userMock);
      assert.throws(() => {
        library.connectOrDisconnectBook('nonExistingId', user);
      }, 'BookStore item not found! Cannon connect the user to the book.');
    });
  });
});
