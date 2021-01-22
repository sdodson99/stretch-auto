import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartRoutineComponent } from './start-routine/start-routine.component';

const routes: Routes = [
  {path: '', component: StartRoutineComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
