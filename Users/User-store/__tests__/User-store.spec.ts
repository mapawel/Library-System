import { assert } from 'chai';
import { UserStore } from '../User-store';
import { userMock } from './user.mock';

describe('User-store tests suite:', () => {
  let userStore: UserStore;
  beforeEach(() => {
    userStore = UserStore.getInstance();
  });
  afterEach(() => {
    UserStore.resetInstance();
  });

  describe('addUser() + getUserByPesel() tests:', () => {
    it('should throw an error when not existing pesel passed to getUserByPesel()', () => {
      assert.throws(() => {
        userStore.getUserByPesel(11111111111);
      }, 'There is no user with this pesel in our base!');
    });

    it('should add a new user to store', () => {
      userStore.addUser(userMock);

      const savedUser = userStore.getUserByPesel(userMock.pesel);

      for (const [key, value] of Object.entries(userMock)) {
        assert.equal(value, savedUser[key as keyof typeof userMock]);
      }
    });

    it('should not add a new user to store coused a passing pesel duplication and throws an error', () => {
      assert.throws(() => {
        userStore.addUser(userMock);
        userStore.addUser({
          pesel: userMock.pesel,
          firstName: 'x',
          lastName: 'y',
        });
      }, 'There is a user with this pesel in our base! User not added again!');
    });
  });
});
