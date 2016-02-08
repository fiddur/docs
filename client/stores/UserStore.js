import { BaseStore } from 'fluxible/addons';

class UserStore extends BaseStore {
  constructor(dispatcher) {
    super(dispatcher);
    this.user = null;
  }
  handleUserLoaded(payload) {
    this.user = payload;
    this.emitChange();
  }
  getUser() {
    return this.user;
  }
  isAuthenticated() {
    return !!this.user;
  }
  dehydrate() {
    return {
      user: this.user,
    };
  }
  rehydrate(state) {
    this.user = state.user;
  }
}

UserStore.storeName = 'UserStore';
UserStore.handlers = {
  'LOAD_USER': 'handleUserLoaded'
};

export default UserStore;
