class Store {
  form = {};

  userInfo = {};

  setFilter(form) {
    this.form = {
      ...form,
    };
  }
}
export const store = new Store();
