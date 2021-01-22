import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoutineService } from './services/routine.service';
import { StartRoutineComponent } from './start-routine/start-routine.component';
import { LayoutComponent } from './layout/layout.component';
import { HttpClientModule } from '@angular/common/http';
import { LiveRoutineComponent } from './live-routine/live-routine.component';

@NgModule({
  declarations: [
    AppComponent,
    StartRoutineComponent,
    LayoutComponent,
    LiveRoutineComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [RoutineService],
  bootstrap: [AppComponent]
})
export class AppModule { }
