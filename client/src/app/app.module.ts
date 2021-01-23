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
import { ChartsModule } from 'ng2-charts';
import { RoutineCountdownComponent } from './routine-countdown/routine-countdown.component';

@NgModule({
  declarations: [
    AppComponent,
    StartRoutineComponent,
    LayoutComponent,
    LiveRoutineComponent,
    RoutineCountdownComponent
  ],
  imports: [
    ChartsModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [RoutineService],
  bootstrap: [AppComponent]
})
export class AppModule { }
