import { Component, Input } from '@angular/core';
import * as $ from 'jquery';
import * as Model from '../AppModel';
import { AppBaseComponent } from '../AppBaseComponent';
import { PipelineService } from '../_services/pipeline.service';

@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.scss']
})
export class PipelineComponent extends AppBaseComponent {
  private _refreshLatestTimer: number;

  constructor(private _service: PipelineService) {
    super();
  }

  @Input()
  public config: Model.PipelineWidgetConfig;

  public executions: Model.PipelineExecution[] = [];

  public active: Model.PipelineExecution;

  protected onInitialize(): Promise<void> {
    return this._loadRecentExecutions();
  }

  private _loadRecentExecutions(): Promise<void> {
    const config = this.config;

    return this._service.getRecent(config.provider, config.pipelineId).then(result => {
      this.executions = result || [];
      this.active = this.executions[0];

      // Periodically check for updates.
      setTimeout(this._loadRecentExecutions.bind(this), 60 * 1000 /* 60 seconds */);
    }).then(() => {
      this._loadActiveExecutionDetail();
    });
  }

  private _loadActiveExecutionDetail(): Promise<void> {
    clearTimeout(this._refreshLatestTimer);

    if (this.active) {
      return this._service.get(this.config.provider, this.active.pipelineId, this.active.id).then(result => {
        if (!this.active || (result && this.active.id === result.id && JSON.stringify(this.active) !== JSON.stringify(result))) {
          $.extend(true, this.active, result);
        }

        if (this.active.status === 'In Progress') {
          // Only refresh when the latest build is in the "Building" state.
          this._refreshLatestTimer = setTimeout(this._loadActiveExecutionDetail.bind(this), 15 * 1000 /* 15 seconds */);
        }
      });
    }

    return Promise.resolve();
  }
}
