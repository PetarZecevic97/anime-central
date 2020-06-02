import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { MainBodyComponent } from './main-body/main-body.component';
import { MostPopularAnimeComponent } from './most-popular-anime/most-popular-anime.component';
import { DisplayAnimeComponent } from './display-anime/display-anime.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LogInComponent } from './log-in/log-in.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
 
import { CarouselModule, WavesModule } from 'angular-bootstrap-md'

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    MainBodyComponent,
    MostPopularAnimeComponent,
    DisplayAnimeComponent,
    NavBarComponent,
    SignUpComponent,
    LogInComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MDBBootstrapModule.forRoot(),
    CarouselModule, 
    WavesModule
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
