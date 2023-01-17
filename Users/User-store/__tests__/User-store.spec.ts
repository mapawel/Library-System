import { assert } from 'chai';
import { UserStore } from '../User.store';
import { userMock } from './user.mock';

describe('User-store tests suite:', () => {
  //given
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
        //when
        userStore.getUserByPesel(11111111111);
        //then
      }, 'There is no user with this pesel in our base!');
    });

    it('should add a new user to store', () => {
      //when
      userStore.addUser(userMock);
      //then
      const savedUser = userStore.getUserByPesel(userMock.pesel);
      for (const [key, value] of Object.entries(userMock)) {
        assert.equal(value, savedUser[key as keyof typeof userMock]);
      }
    });

    it('should not add a new user to store coused a passing pesel duplication and throws an error', () => {
      assert.throws(() => {
        //given
        userStore.addUser(userMock);
        //when
        userStore.addUser({
          pesel: userMock.pesel,
          firstName: 'x',
          lastName: 'y',
        });
        //then
      }, 'There is a user with this pesel in our base! User not added again!');
    });
  });
});
