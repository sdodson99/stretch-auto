import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveRoutineComponent } from './routine/live-routine/live-routine.component';
import { PreviewRoutineComponent } from './routine/preview-routine/preview-routine.component';
import { QuickStartRoutineComponent } from './routine/quick-start-routine/quick-start-routine.component';

const routes: Routes = [
  { path: '', component: QuickStartRoutineComponent },
  { path: 'routine/live', component: LiveRoutineComponent },
  { path: 'routine/preview', component: PreviewRoutineComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
