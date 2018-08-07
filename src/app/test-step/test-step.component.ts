import { Component, Input } from '@angular/core';
import { environment } from '../../environments/environment';
import * as Model from '../AppModel';
import { AppBaseComponent } from '../AppBaseComponent';
import { PipelineService } from '../_services/pipeline.service';

@Component({
  selector: 'app-test-step',
  templateUrl: './test-step.component.html',
  styleUrls: ['./test-step.component.scss']
})
export class TestStepComponent extends AppBaseComponent {
  private _refreshTimer: number;

  constructor(private _service: PipelineService) {
    super();
  }

  @Input()
  public pipelineConfig: Model.PipelineWidgetConfig;

  @Input()
  public executionId: string;

  @Input()
  public config: Model.PipelineTestStepConfig;

  public active: Model.PipelineTestRun;

  protected onInitialize(): Promise<void> {
    return this._loadPipelineTestExecution();
  }

  private _loadPipelineTestExecution(): Promise<void> {
    clearTimeout(this._refreshTimer);

    // tslint:disable-next-line:max-line-length
    return this._service.getTestRun(this.pipelineConfig.provider, this.pipelineConfig.pipelineId, this.executionId, this.config.id).then(result => {
      this.active = result;

      const interval = this.active.status === 'Running'
        ? environment.refreshIntervalInSecondsForInProgressExecution
        : environment.refreshIntervalInSecondsForCompletedExecution;

      // Periodically check for updates.
      this._refreshTimer = setTimeout(this._loadPipelineTestExecution.bind(this), interval * 1000);
    });
  }
}
