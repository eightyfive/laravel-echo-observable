import { Observable } from "rxjs";

export default class PublicChannel {
  constructor(channel, destroy) {
    this.channel = channel;
    this.unsubscribe = destroy;
    this.events = {};
  }

  listen(eventName) {
    return this.getObservable(eventName, "listen");
  }

  getObservable(eventName, method = null) {
    if (!this.events[eventName]) {
      this.events[eventName] = Observable.create(observer => {
        this.channel[method || eventName].apply(this, [
          eventName,
          ev => observer.next(ev)
        ]);

        // observer.complete();
        // observer.error(err);

        return this.unsubscribe;
      });
    }
    return this.events[eventName];
  }

  whisper(eventName, data) {
    this.channel.whisper(eventName, data);
  }

  listenForWhisper(eventName) {
    return this.getObservable(eventName, "listenForWhisper");
  }
}
