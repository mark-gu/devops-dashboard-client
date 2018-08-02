export interface AppDisplayMessage {
  title: string;
  message: string;
  severity: string;
  detail?: string;
  debug?: string;
}

export interface DashboardConfig {
  title: string;
  description: string;
  columnConfigs: ColumnConfig[];
}

export interface ColumnConfig {
  title: string;
  widgetConfigs: WidgetConfig[];
}

export interface WidgetConfig {
  title: string;
  type: string;
  provider: string;
}

export interface DashboardConfigUploadResult {
  dashboardName: string;
}

export interface BuildResultsWidgetConfig extends WidgetConfig {
  projectId: string;
}

export interface BuildResult {
  projectId: string;
  buildId: string;
  buildNumber: number;
  reason: string;
  status: string;
  class: string;
  timeStarted: string;
  duration: string;
  uri: string;
}
