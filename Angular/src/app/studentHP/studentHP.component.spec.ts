import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { studentHPComponent } from './studentHP.component';

describe('SettingsComponent', () => {
  let component: studentHPComponent;
  let fixture: ComponentFixture<studentHPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ studentHPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(studentHPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
