import BaseStore from 'fluxible/addons/BaseStore';

class UserStore extends BaseStore {

  constructor(dispatcher) {
    super(dispatcher);
    this.user = null;
  }

  isAuthenticated() {
    return this.user && this.user.account.userName !== '';
  }

  getUser() {
    return this.user;
  }

  handleUserLoaded(payload) {
    this.user = payload.user;
    this.emitChange();
  }

  dehydrate() {
    return {
      user: this.user
    };
  }

  rehydrate(state) {
    this.user = state.user;
  }

}

UserStore.storeName = 'UserStore';
UserStore.handlers = {
  USER_LOADED: 'handleUserLoaded'
};

export default UserStore;
