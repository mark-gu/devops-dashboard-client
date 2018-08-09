import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MomentModule } from 'ngx-moment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ColumnComponent } from './column/column.component';
import { WidgetComponent } from './widget/widget.component';
import { PipelineComponent } from './pipeline/pipeline.component';
import { TestStepComponent } from './test-step/test-step.component';

library.add(fas);

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ColumnComponent,
    WidgetComponent,
    PipelineComponent,
    TestStepComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MomentModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
