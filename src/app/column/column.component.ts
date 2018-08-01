import { Component, Input } from '@angular/core';
import * as Model from '../AppModel';
import { AppBaseComponent } from '../AppBaseComponent';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss']
})
export class ColumnComponent extends AppBaseComponent {
  constructor() {
    super();
  }

  @Input() config: Model.ColumnConfig;

  protected onInitialize(): Promise<void> {
    return Promise.resolve();
  }
}
