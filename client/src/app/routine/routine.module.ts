import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickStartRoutineComponent } from './quick-start-routine/quick-start-routine.component';
import { PreviewRoutineComponent } from './preview-routine/preview-routine.component';
import { LiveRoutineComponent } from './live-routine/live-routine.component';
import { RoutineCountdownComponent } from './live-routine/routine-countdown/routine-countdown.component';
import { RoutineService } from './routine.service';
import { LiveRoutineService } from './live-routine.service';
import { ChartsModule } from 'ng2-charts';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    QuickStartRoutineComponent,
    PreviewRoutineComponent,
    LiveRoutineComponent,
    RoutineCountdownComponent,
  ],
  providers: [RoutineService, LiveRoutineService],
  imports: [
    CommonModule,
    ChartsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SharedModule,
  ],
})
export class RoutineModule {}
