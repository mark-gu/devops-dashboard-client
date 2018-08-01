import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildResultsComponent } from './build-results.component';

describe('BuildResultsComponent', () => {
  let component: BuildResultsComponent;
  let fixture: ComponentFixture<BuildResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
