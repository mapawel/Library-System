import { assert } from 'chai';
import { BookStore } from '../Book-store';
import { User } from '../../../Users/User/User.class';
import { bookMock } from './book.mock';
import type { BookStoreItem } from '../BookStoreItem.type';
import { userMock } from './user.mock';

describe('BookStore tests suite:', () => {
  //given
  let library: BookStore;
  beforeEach(() => {
    library = BookStore.getInstance();
  });
  afterEach(() => {
    BookStore.resetInstance();
  });

  describe('addBook() tests:', () => {
    it('should add a book to field book in library item object', () => {
      //when
      const bookStoreItem: BookStoreItem = library.addBook(bookMock);
      //then
      assert.deepEqual(bookStoreItem.book, bookMock);
    });

    it('should create field user with value of null for new added book', () => {
      //when
      const bookStoreItem: BookStoreItem = library.addBook(bookMock);
      //then
      assert.isNull(bookStoreItem.user);
    });

    it('should throw error while adding a book with the same uuid', () => {
      assert.throws(() => {
        //given
        library.addBook(bookMock);
        //when
        library.addBook(bookMock);
        //then
      }, "This book uuid has already been in our system. Couldn't add it again!");
    });
  });

  describe('getItemById() tests:', () => {
    it('should return a library item by uuid', () => {
      //given
      const bookStoreItem: BookStoreItem = library.addBook(bookMock);
      //when
      const foundLibraryItem = library.getItemById(bookStoreItem.book.uuid);
      //then
      assert.deepEqual(bookStoreItem, foundLibraryItem);
    });

    it('should throw error while getting by unexisting uuid', () => {
      assert.throws(() => {
        //when
        library.getItemById('nonExistingId');
        //then
      }, 'Passed book uuid not found.');
    });
  });

  describe('removeItemById() tests:', () => {
    it('should remove library item with specyfic uuid and throw an error on try of getting removed item', () => {
      //given
      const bookStoreItem: BookStoreItem = library.addBook(bookMock);
      assert.deepEqual(
        bookStoreItem,
        library.getItemById(bookStoreItem.book.uuid)
      );
      library.removeItemById(bookStoreItem.book.uuid);
      assert.throws(() => {
        //when
        library.getItemById(bookStoreItem.book.uuid);
        //then
      }, 'Passed book uuid not found.');
    });

    it('should throw an error on try to remove non existing item', () => {
      assert.throws(() => {
        //when
        library.removeItemById('nonExistingId');
        //then
      }, "Passed book uuid not found. Couldn't remove the book!");
    });

    it('should throw an error on try to remove a book which is booked', () => {
      //given
      const bookStoreItem: BookStoreItem = library.addBook(bookMock);
      const user: User = new User(userMock);
      assert.deepEqual(
        bookStoreItem,
        library.getItemById(bookStoreItem.book.uuid)
      );
      library.connectOrDisconnectBook(bookStoreItem.book.uuid, user);
      assert.throws(() => {
        //when
        library.removeItemById(bookStoreItem.book.uuid);
        //then
      }, 'This book has already been booked. Removing possible after returnement.');
    });
  });

  describe('connectOrDisconnectBook() tests:', () => {
    it('should connect specyfic user to user field of library item', () => {
      //given
      const addedLibraryItem: BookStoreItem = library.addBook(bookMock);
      const user: User = new User(userMock);
      //when
      library.connectOrDisconnectBook(addedLibraryItem.book.uuid, user);
      //then
      const bookStoreItem: BookStoreItem = library.getItemById(
        addedLibraryItem.book.uuid
      );
      assert.deepEqual(bookStoreItem.user, user);
    });

    it('should throw error on try to connect non existing library item with user', () => {
      //given
      const user: User = new User(userMock);
      assert.throws(() => {
        //when
        library.connectOrDisconnectBook('nonExistingId', user);
        //then
      }, 'BookStore item not found! Cannon connect the user to the book.');
    });
  });
});
