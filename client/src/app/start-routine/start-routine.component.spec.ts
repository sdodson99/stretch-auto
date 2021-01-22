import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartRoutineComponent } from './start-routine.component';

describe('StretchComponent', () => {
  let component: StartRoutineComponent;
  let fixture: ComponentFixture<StartRoutineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartRoutineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartRoutineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
