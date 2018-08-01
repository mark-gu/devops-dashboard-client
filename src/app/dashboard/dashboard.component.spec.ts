import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from '../_services/dashboard.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardServiceSpy: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [HttpClientTestingModule, FontAwesomeModule],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            params: {
              subscribe: (fn: (value) => void) => fn({
              }),
            },
            snapshot: {
              paramMap: {
                get: name => {
                  if (name === 'name') {
                    return 'default';
                  }
                }
              }
            }
          }
        },
        {
          provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); }
        },
        {
          provide: DashboardService, useValue: jasmine.createSpyObj('DashboardService', ['get'])
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load a dashboard on start-up', () => {
    const testDashboardConfig = {
      title: 'My Test Dashboard',
      columns: []
    };

    dashboardServiceSpy = TestBed.get(DashboardService);
    dashboardServiceSpy.get.and.returnValue({
      subscribe: (fn) => {
        return fn(testDashboardConfig);
        // return Promise.resolve(testDashboardConfig).then(config => fn(config));
      }
    });

    fixture.detectChanges();

    expect(dashboardServiceSpy.get.calls.count()).toBe(1);
    expect(component.config).toBeTruthy();
    expect(component.config.title).toEqual(testDashboardConfig.title);
    expect(component.config.columnConfigs.length).toEqual(testDashboardConfig.columns.length);
  });
});
