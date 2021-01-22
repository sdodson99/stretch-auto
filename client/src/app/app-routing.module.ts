import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveRoutineComponent } from './live-routine/live-routine.component';
import { StartRoutineComponent } from './start-routine/start-routine.component';

const routes: Routes = [
  { path: '', component: StartRoutineComponent },
  { path: 'routine', component: LiveRoutineComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
