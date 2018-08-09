import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import * as $ from 'jquery';
import * as Model from '../AppModel';
import { AppBaseComponent } from '../AppBaseComponent';
import { DashboardService } from '../_services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends AppBaseComponent {
  private _refreshTimer: number;

  public config: Model.DashboardConfig;

  public displayMessage: Model.AppDisplayMessage;

  constructor(private _route: ActivatedRoute, private _router: Router, private _service: DashboardService) {
    super();
  }

  protected onInitialize(): Promise<void> {
    if (!this.subscriptions.hasOwnProperty('RouteParamsSubscription')) {
      this.subscriptions['RouteParamsSubscription'] = this._route.params.subscribe(() => {
        const dashboardName = this._route.snapshot.paramMap.get('name') || 'default';
        this._clearDashboard();
        this._loadDashboard(dashboardName);
      });
    }

    return Promise.resolve();
  }

  public selectFile() {
    $('input#upload').click();
  }

  public toggleTheme() {
    const $body = $('body');
    if ($body.hasClass('bg-dark')) {
      $body.removeClass('bg-dark text-light');
    } else {
      $body.addClass('bg-dark text-light');
    }

    const $buttons = $('button, .btn');
    if ($buttons.hasClass('btn-dark')) {
      $buttons.removeClass('btn-dark').addClass('btn-light');
    } else {
      $buttons.removeClass('btn-light').addClass('btn-dark');
    }
  }

  public configFileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const validationResult = this._validateDashboardConfigFile(fileList[0]);
      if (validationResult.isValid) {
        this._uploadDashboardConfigFile(validationResult.filename, validationResult.file).then(result => {
          if (result && window.confirm('Upload succeeded. Do you want to display your dashboard?')) {
            this._router.navigate([`../${result.dashboardName}`], { relativeTo: this._route });
          }
        });
      } else {
        window.alert(validationResult.error);
      }
    }
  }

  private _clearDashboard() {
    this.config = null;
    this.displayMessage = null;
  }

  private _loadDashboard(name: string) {
    clearTimeout(this._refreshTimer);

    this._service.get(name).then(result => {
      const newConfig = result;
      if (!newConfig) {
        this._createDisplayMessage(name, 404);
      } else if (JSON.stringify(newConfig) !== JSON.stringify(this.config)) {
        this.config = newConfig;
      }

      // Periodically check for updates to the dashboard configuration.
      this._refreshTimer = setTimeout(this._loadDashboard.bind(this, name), environment.refreshIntervalInSecondsForDashboard * 1000);
    }).catch(reason => {
      this._createDisplayMessage(name, reason.status, reason.message);
    });
  }

  private _validateDashboardConfigFile(file: File): { filename: string; file: File; isValid: boolean; error: string; } {
    let errorMessage: string;

    let filename = file.name.replace(/([^a-zA-Z0-9.-_]+)/gi, '').toLowerCase();
    if (filename.endsWith('.yaml')) {
      filename = filename.slice(0, filename.length - 5) + '.yml';
    }

    if (!filename.endsWith('.json') && !filename.endsWith('.yml')) {
      errorMessage = 'Unsupported file type. Please select a JSON or YML file.';
    } else if (file.size > 100 * 1024) {
      errorMessage = 'File size too large. Please select a file that is smaller than 100K.';
    }

    return {
      filename: filename,
      file: file,
      isValid: !errorMessage,
      error: errorMessage,
    };
  }

  private _uploadDashboardConfigFile(filename: string, file: File): Promise<Model.DashboardConfigUploadResult> {
    return this._service.post(filename, file);
  }

  private _createDisplayMessage(dashboardName: string, status: number, message?: string): void {
    switch (status) {
      case 404:
        this.displayMessage = {
          title: 'Oops...',
          message: `Can't find the dashboard: ${dashboardName}`,
          detail: 'Use the upload button to upload your own dashboard configuration.',
          severity: 'info'
        };
        break;

      default:
        this.displayMessage = {
          title: 'Hmm...',
          message: `Something's wrong when loading the dashboard: ${dashboardName}`,
          detail: message,
          severity: 'error'
        };
        break;
    }
  }
}
