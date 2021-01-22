import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveRoutineComponent } from './live-routine.component';

describe('LiveRoutineComponent', () => {
  let component: LiveRoutineComponent;
  let fixture: ComponentFixture<LiveRoutineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveRoutineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveRoutineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
