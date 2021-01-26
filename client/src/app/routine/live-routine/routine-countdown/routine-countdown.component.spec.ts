import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutineCountdownComponent } from './routine-countdown.component';

describe('RoutineCountdownComponent', () => {
  let component: RoutineCountdownComponent;
  let fixture: ComponentFixture<RoutineCountdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutineCountdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutineCountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
