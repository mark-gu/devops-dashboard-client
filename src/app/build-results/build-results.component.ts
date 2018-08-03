import { Component, Input } from '@angular/core';
import * as Model from '../AppModel';
import { AppBaseComponent } from '../AppBaseComponent';
import { BuildResultsService } from '../_services/build-results.service';

@Component({
  selector: 'app-build-results',
  templateUrl: './build-results.component.html',
  styleUrls: ['./build-results.component.scss']
})
export class BuildResultsComponent extends AppBaseComponent {
  private _refreshLatestTimer: number;

  constructor(private _service: BuildResultsService) {
    super();
  }

  @Input()
  public config: Model.BuildResultsWidgetConfig;

  public buildResults: BuildResults;

  protected onInitialize(): Promise<void> {
    return this._loadBuildResults();
  }

  private _loadBuildResults(): Promise<void> {
    const config = this.config;

    return this._service.getRecent(config.provider, config.projectId).then(result => {
      const builds = result || [];
      this.buildResults = {
        all: builds,
        latest: builds[0] || null,
        previous: builds.splice(1)
      };

      // Periodically check for updates.
      setTimeout(this._loadBuildResults.bind(this), 60 * 1000 /* 60 seconds */);
    }).then(() => {
      this._loadLatestBuildDetails();
    });
  }

  private _loadLatestBuildDetails(): Promise<void> {
    clearTimeout(this._refreshLatestTimer);

    const latest = this.buildResults.latest;
    if (latest) {
      return this._service.get(this.config.provider, latest.projectId, latest.buildId).then(result => {
        const latestInner = this.buildResults.latest;
        if (!latestInner || (result && latestInner.buildId === result.buildId && JSON.stringify(latestInner) !== JSON.stringify(result))) {
          this.buildResults.latest = result;
        }

        if (result.status === 'Building') {
          // Only refresh when the latest build is in the "Building" state.
          this._refreshLatestTimer = setTimeout(this._loadLatestBuildDetails.bind(this), 15 * 1000 /* 15 seconds */);
        }
      });
    }

    return Promise.resolve();
  }
}

class BuildResults {
  all: Model.BuildResult[];
  latest: Model.BuildResult;
  previous: Model.BuildResult[];
}
