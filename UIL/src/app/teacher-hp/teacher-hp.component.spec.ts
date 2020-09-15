import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherHPComponent } from './teacher-hp.component';

describe('TeacherHPComponent', () => {
  let component: TeacherHPComponent;
  let fixture: ComponentFixture<TeacherHPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherHPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherHPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
