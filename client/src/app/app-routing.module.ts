import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveRoutineComponent } from './live-routine/live-routine.component';
import { QuickStartRoutineComponent } from './quick-start-routine/quick-start-routine.component';

const routes: Routes = [
  { path: '', component: QuickStartRoutineComponent },
  { path: 'routine', component: LiveRoutineComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
