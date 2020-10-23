import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroservicesDashboardComponent } from './microservices-dashboard.component';

describe('MicroservicesDashboardComponent', () => {
  let component: MicroservicesDashboardComponent;
  let fixture: ComponentFixture<MicroservicesDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroservicesDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroservicesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
