import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StretchComponent } from './stretch/stretch.component';

const routes: Routes = [
  {path: '', component: StretchComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
