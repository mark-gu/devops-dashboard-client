import { Injectable, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import * as Model from '../AppModel';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private _uri = `${environment.serverBaseUri}/dashboards`;

  constructor(private _http: HttpClient) { }

  get(name: string): Promise<Model.DashboardConfig> {
    return this._http.get(`${this._uri}/${name}`).pipe(
      map(result => <Model.DashboardConfig>result)
    ).toPromise();
  }

  post(filename: string, file: File): Promise<any> {
    const formData: FormData = new FormData();
    formData.append('uploadFile', file, filename);

    return this._http.post(`${this._uri}`, formData, {
      headers: {
        'Accept': 'application/json'
      },
      responseType: 'json'
    }).toPromise();
  }
}
