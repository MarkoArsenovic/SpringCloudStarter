import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserRolesFormComponent } from './update-user-roles-form.component';

describe('UpdateUserRolesFormComponent', () => {
  let component: UpdateUserRolesFormComponent;
  let fixture: ComponentFixture<UpdateUserRolesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateUserRolesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUserRolesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
