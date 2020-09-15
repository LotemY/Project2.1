import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentHPComponent } from './student-hp.component';

describe('StudentHPComponent', () => {
  let component: StudentHPComponent;
  let fixture: ComponentFixture<StudentHPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentHPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentHPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
