import { Component } from '@angular/core';
import * as Bootstrap from 'bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'DevOps Dashboard';

  public bootstrap = Bootstrap;
}
