import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SClassComponent } from './s-class.component';

describe('SClassComponent', () => {
  let component: SClassComponent;
  let fixture: ComponentFixture<SClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
