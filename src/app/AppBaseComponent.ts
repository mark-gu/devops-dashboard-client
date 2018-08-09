import { OnInit, OnDestroy } from '@angular/core';
import * as Bootstrap from 'bootstrap';
import * as Model from './AppModel';

export abstract class AppBaseComponent implements OnInit, OnDestroy {
  protected constructor() {
  }

  protected initialized = false;

  protected error: Error;

  protected subscriptions: any = {};

  protected bootstrap = Bootstrap;

  ngOnInit() {
    this.onInitialize()
      .then(() => {
        this.initialized = true;
      })
      .catch(reason => {
        console.error(reason);
        this.error = new Error('Component initialization failed.');
      });
  }

  protected abstract onInitialize(): Promise<void>;

  ngOnDestroy(): void {
    if (this.subscriptions) {
      for (const key in this.subscriptions) {
        if (this.subscriptions.hasOwnProperty(key) && this.subscriptions[key]) {
          this.subscriptions[key].unsubscribe();
        }
      }
    }
  }
}
