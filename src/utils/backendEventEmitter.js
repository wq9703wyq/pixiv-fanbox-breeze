export default class BackendEventEmitter {
  constructor() {
    this.eventList = [];
  }

  on(event, callback) {
    (this.eventList[event] || (this.eventList[event] = [])) &&
      this.eventList[event].push(callback);
  }

  async emit(event, args, sender) {
    const fnList = this.eventList[event] || [];
    if (!fnList.length) {
      return false;
    }
    return Promise.all(fnList.map((fn) => fn(args, sender)));
  }
}
