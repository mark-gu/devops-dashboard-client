import { Component, Input } from '@angular/core';
import * as Model from '../AppModel';
import { AppBaseComponent } from '../AppBaseComponent';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent extends AppBaseComponent {
  constructor() {
    super();
  }

  @Input() config: Model.WidgetConfig;

  protected onInitialize(): Promise<void> {
    return Promise.resolve();
  }
}
