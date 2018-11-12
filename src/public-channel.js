import { Observable } from "rxjs";

export default class PublicChannel {
  constructor(channel, destroy) {
    this.channel = channel;
    this.unsubscribe = destroy;
    this.events = {};
  }

  listen(eventName) {
    if (!this.events[eventName]) {
      this.events[eventName] = Observable.create(observer => {
        this.channel.listen(eventName, ev => observer.next(ev));

        // observer.complete();
        // observer.error(err);

        return this.unsubscribe;
      });
    }

    return this.events[eventName];
  }
}
