import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { MainBodyComponent } from './main-body/main-body.component';
import { MostPopularAnimeComponent } from './most-popular-anime/most-popular-anime.component';
import { DisplayAnimeComponent } from './display-anime/display-anime.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    MainBodyComponent,
    MostPopularAnimeComponent,
    DisplayAnimeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
