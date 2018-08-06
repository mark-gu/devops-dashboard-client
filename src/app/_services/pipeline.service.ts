import { Injectable, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import * as Model from '../AppModel';

@Injectable({
  providedIn: 'root'
})
export class PipelineService {
  private _uri = `${environment.serverBaseUri}/pipelines`;

  constructor(private _http: HttpClient) { }

  public getRecent(providerName: string, pipelineId: string, top: number = 10): Promise<Model.PipelineExecution[]> {
    return this._http.get(`${this._uri}/${providerName}/${pipelineId}?top=${top}`).pipe(
      map((items: any[]) => {
        items.forEach(this._enrich);
        return items;
      })
    ).toPromise();
  }

  public get(providerName: string, pipelineId: string, executionId: string): Promise<Model.PipelineExecution> {
    return this._http.get(`${this._uri}/${providerName}/${pipelineId}/executions/${executionId}`).pipe(
      map(this._enrich)
    ).toPromise();
  }

  private _enrich(item: any): Model.PipelineExecution {
    item.ui = {
      label: item.sequenceNumber ? '#' + item.sequenceNumber : item.id
    };

    switch (item.status) {
      case 'Failed':
        item.ui.statusClass = 'danger';
        break;
      case 'Succeeded':
        item.ui.statusClass = 'success';
        break;
      default:
        item.ui.statusClass = 'info';
        break;
    }

    return <Model.PipelineExecution>item;
  }
}
