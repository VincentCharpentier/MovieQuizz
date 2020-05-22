export default class EventBus {
  listeners = {};
  _check(eventName) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
  }
  addEventListener(eventName, cb) {
    this._check(eventName);
    this.listeners[eventName].push(cb);
  }
  removeEventListener(eventName, cb) {
    this._check(eventName);
    this.listeners[eventName] = this.listeners[eventName].filter(
      (fn) => fn !== cb,
    );
  }
  emit(eventName, ...payload) {
    this._check(eventName);
    this.listeners[eventName].forEach((cb) => setTimeout(cb, 0, ...payload));
  }
}
