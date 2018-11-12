import { Observable } from "rxjs";
//
import PublicChannel from "./public-channel";

const presenceMethods = ["here", "joining", "leaving"];

export default class PresenceChannel extends PublicChannel {
  here() {
    return this.listen("here");
  }

  joining() {
    return this.listen("joining");
  }

  leaving() {
    return this.listen("leaving");
  }

  listen(eventName) {
    if (!this.events[eventName]) {
      if (presenceMethods.indexOf(eventName) === -1) {
        return super.listen(eventName);
      }

      // eventName is "here", "joining" or "leaving"
      this.events[eventName] = Observable.create(observer => {
        this.channel[eventName](ev => observer.next(ev));

        // observer.complete();
        // observer.error(err);

        return this.unsubscribe;
      });
    }

    return this.events[eventName];
  }
}
