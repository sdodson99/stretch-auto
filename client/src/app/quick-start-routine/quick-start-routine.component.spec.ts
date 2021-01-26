import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickStartRoutineComponent } from './quick-start-routine.component';

describe('StretchComponent', () => {
  let component: QuickStartRoutineComponent;
  let fixture: ComponentFixture<QuickStartRoutineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuickStartRoutineComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickStartRoutineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
