import { fromEventPattern, Observable } from "rxjs";

export default class PublicChannel {
  constructor(channel, leave) {
    this.channel = channel;
    this.leave = leave;
    this.events = {};
  }

  listen$(eventName) {
    return this.getObservable("listen", eventName);
  }

  listenForWhisper$(eventName) {
    return this.getObservable("listenForWhisper", eventName);
  }

  whisper(eventName, data) {
    this.channel.whisper(eventName, data);
  }

  getObservable(method, eventName) {
    if (!this.events[eventName]) {
      const args = [handler];

      if (eventName) {
        args.unshift(eventName);
      }

      this.events[eventName] = fromEventPattern(
        handler => this.channel[method](...args),
        this.leave
      );
    }

    return this.events[eventName];
  }
}
