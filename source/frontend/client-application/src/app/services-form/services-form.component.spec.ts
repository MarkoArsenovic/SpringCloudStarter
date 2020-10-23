import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesFormComponent } from './services-form.component';

describe('ServicesFormComponent', () => {
  let component: ServicesFormComponent;
  let fixture: ComponentFixture<ServicesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
