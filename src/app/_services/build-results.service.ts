import { Injectable, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import * as Model from '../AppModel';

@Injectable({
  providedIn: 'root'
})
export class BuildResultsService {
  private _uri = `${environment.serverBaseUri}/build-results`;

  constructor(private _http: HttpClient) { }

  public getRecent(providerName: string, projectId: string, top: number = 10): Promise<Model.BuildResult[]> {
    return this._http.get(`${this._uri}/${providerName}/projects/${projectId}?top=${top}`).pipe(
      map((items: any[]) => {
        items.forEach(this._convertToBuildResult);
        return items;
      })
    ).toPromise();
  }

  public get(providerName: string, projectId: string, buildId: string): Promise<Model.BuildResult> {
    return this._http.get(`${this._uri}/${providerName}/projects/${projectId}/builds/${buildId}`).pipe(
      map(this._convertToBuildResult)
    ).toPromise();
  }

  private _convertToBuildResult(item: any): Model.BuildResult {
    switch (item.status) {
      case 'Successful':
        item.class = 'success';
        break;
      case 'Failed':
        item.class = 'danger';
        break;
      default:
        item.class = 'info';
        break;
    }

    return <Model.BuildResult>item;
  }
}
