import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsDashboardComponent } from './permissions-dashboard.component';

describe('PermissionsDashboardComponent', () => {
  let component: PermissionsDashboardComponent;
  let fixture: ComponentFixture<PermissionsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermissionsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
