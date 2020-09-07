import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { teacherHPComponent } from './teacherHP.component';

describe('HomePageComponent', () => {
  let component: teacherHPComponent;
  let fixture: ComponentFixture<teacherHPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ teacherHPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(teacherHPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
