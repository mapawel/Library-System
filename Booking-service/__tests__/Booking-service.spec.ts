import { LibraryItem } from '../../Library/LibraryItem.type';
import { User } from '../../Users/User.class';
import { UserStore } from '../../Users/User-store/User-store.class';
import { BookingService } from '../Booking-service.class';
import { Library } from '../../Library/Library.class';
import { bookMock } from './book.mock';
import { userMock } from './user.mock';

describe('Booking-service tests suite:', () => {
  let bookingService: BookingService;
  let library: Library;
  let userStore: UserStore;
  let libraryItem: LibraryItem;
  let user: User;

  beforeEach(() => {
    bookingService = BookingService.getInstance();
    library = Library.getInstance();
    userStore = UserStore.getInstance();
    user = userStore.addUser(userMock);
    libraryItem = library.addBook(bookMock);
  });
  afterEach(() => {
    BookingService.resetInstance();
    Library.resetInstance();
    UserStore.resetInstance();
  });

  describe('bookBook() tests:', () => {
    it('', () => {});
  });
});
