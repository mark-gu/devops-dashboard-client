import { Component, Input } from '@angular/core';
import * as Model from '../AppModel';
import { AppBaseComponent } from '../AppBaseComponent';
import { PipelineService } from '../_services/pipeline.service';

@Component({
  selector: 'app-test-step',
  templateUrl: './test-step.component.html',
  styleUrls: ['./test-step.component.scss']
})
export class TestStepComponent extends AppBaseComponent {

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
    // tslint:disable-next-line:max-line-length
    return this._service.getTestRun(this.pipelineConfig.provider, this.pipelineConfig.pipelineId, this.executionId, this.config.id).then(result => {
      this.active = result;

      // Periodically check for updates.
      setTimeout(this._loadPipelineTestExecution.bind(this), 60 * 1000 /* 60 seconds */);
    });
  }
}
