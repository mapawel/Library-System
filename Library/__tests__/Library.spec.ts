import { assert } from 'chai';
import { Library } from '../Library.class';
import { User } from '../../Users/User.class';
import { bookMock } from './book.mock';
import type { LibraryItem } from '../LibraryItem.type';
import { userMock } from './user.mock';

describe('Library tests suite:', () => {
  let library: Library;
  beforeEach(() => {
    library = Library.getInstance();
  });
  afterEach(() => {
    Library.resetInstance();
  });

  describe('addBook() tests:', () => {
    it('should add a book to field book in library item object', () => {
      const libraryItem: LibraryItem = library.addBook(bookMock);
      assert.deepEqual(libraryItem.book, bookMock);
    });

    it('should create field user with value of null for new added book', () => {
      const libraryItem: LibraryItem = library.addBook(bookMock);
      assert.isNull(libraryItem.user);
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
      const libraryItem: LibraryItem = library.addBook(bookMock);
      const foundLibraryItem = library.getItemById(libraryItem.book.uuid);
      assert.deepEqual(libraryItem, foundLibraryItem);
    });

    it('should throw error while getting by unexisting uuid', () => {
      assert.throws(() => {
        library.getItemById('nonExistingId');
      }, 'Passed book uuid not found.');
    });
  });

  describe('removeItemById() tests:', () => {
    it('should remove library item with specyfic uuid and throws error on try of getting removed item', () => {
      const libraryItem: LibraryItem = library.addBook(bookMock);
      assert.deepEqual(libraryItem, library.getItemById(libraryItem.book.uuid));
      library.removeItemById(libraryItem.book.uuid);
      assert.throws(() => {
        library.getItemById(libraryItem.book.uuid);
      }, 'Passed book uuid not found.');
    });

    it('should throws error on try to remove non existing item', () => {
      assert.throws(() => {
        library.removeItemById('nonExistingId');
      }, "Passed book uuid not found. Couldn't remove the book!");
    });

    it('should throws error on try to remove which is booked', () => {
      const libraryItem: LibraryItem = library.addBook(bookMock);
      const user: User = new User(userMock);
      assert.deepEqual(libraryItem, library.getItemById(libraryItem.book.uuid));
      library.connectBookWhUser(libraryItem.book.uuid, user);
      assert.throws(() => {
        library.removeItemById(libraryItem.book.uuid);
      }, 'This book has already been booked. Removing possible after returnement.');
    });
  });

  describe('connectBookWhUser() tests:', () => {
    it('should connect specyfic user to user field of library item', () => {
      const addedLibraryItem: LibraryItem = library.addBook(bookMock);
      const user: User = new User(userMock);
      library.connectBookWhUser(addedLibraryItem.book.uuid, user);
      const libraryItem: LibraryItem = library.getItemById(
        addedLibraryItem.book.uuid
      );
      assert.deepEqual(libraryItem.user, user);
    });

    it('should throws error on try to connect non existing library item with user', () => {
      const user: User = new User(userMock);
      assert.throws(() => {
        library.connectBookWhUser('nonExistingId', user);
      }, "Library item not found! Cannon connect the user to the book.");
    });
  });
});
