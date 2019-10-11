import { fromEventPattern } from "rxjs";

export default class PublicChannel {
  constructor(channel, leave) {
    this.channel = channel;
    this.leave = leave;
  }

  listen$(event) {
    return this.getObservable("listen", event);
  }

  listenForWhisper$(event) {
    return this.getObservable("listenForWhisper", event);
  }

  whisper(...args) {
    this.channel.whisper(...args);
  }

  getObservable(method, event) {
    return fromEventPattern(handler => {
      if (event) {
        this.channel[method](event, handler);
      } else {
        this.channel[method](handler);
      }
    }, this.leave);
  }
}
