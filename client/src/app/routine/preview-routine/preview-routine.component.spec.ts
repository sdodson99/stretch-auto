import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewRoutineComponent } from './preview-routine.component';

describe('PreviewRoutineComponent', () => {
  let component: PreviewRoutineComponent;
  let fixture: ComponentFixture<PreviewRoutineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewRoutineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewRoutineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
