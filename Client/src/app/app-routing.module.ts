import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LogInComponent } from './log-in/log-in.component';
import { DisplayAnimeComponent } from './display-anime/display-anime.component';


const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'signup', component: SignUpComponent},
  {path: 'login', component: LogInComponent},
  {path: 'anime/:name', component: DisplayAnimeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
