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
        items.forEach(this._enrichPipelineExecution);
        return items;
      })
    ).toPromise();
  }

  public get(providerName: string, pipelineId: string, executionId: string): Promise<Model.PipelineExecution> {
    return this._http.get(`${this._uri}/${providerName}/${pipelineId}/executions/${executionId}`).pipe(
      map(this._enrichPipelineExecution)
    ).toPromise();
  }

  // tslint:disable-next-line:max-line-length
  public getTestRun(providerName: string, pipelineId: string, executionId: string, testStepId: string): Promise<Model.PipelineTestRun> {
    return this._http.get(`${this._uri}/${providerName}/${pipelineId}/executions/${executionId}/test-steps/${testStepId}`).pipe(
      map(this._enrichPipelineTestRun)
    ).toPromise();
  }

  private _enrichPipelineExecution(item: any): Model.PipelineExecution {
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

  private _enrichPipelineTestRun(item: any): Model.PipelineTestRun {
    return <Model.PipelineTestRun>item;
  }
}
