import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { HttpClientModule } from '@angular/common/http';
import { RoutineModule } from './routine/routine.module';

@NgModule({
  declarations: [AppComponent, LayoutComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, RoutineModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
