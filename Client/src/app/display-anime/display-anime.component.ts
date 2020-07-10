import { Component, OnInit, Input } from '@angular/core';
import { Anime } from '../models/model.anime';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AnimeServiceService } from '../services/anime-service.service';
import { LogInService } from '../services/log-in.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-display-anime',
  templateUrl: './display-anime.component.html',
  styleUrls: ['./display-anime.component.css']
})
export class DisplayAnimeComponent implements OnInit {

  public anime: Anime = {
    id: 0,
    name: '',
    description: '',
    picture: '',
    picture_URL: '',
    date_aired: '',
    total_score: 0
  };
  public rateForm : FormGroup;
  public thisUserRated : boolean = false;

  constructor(
    private route: ActivatedRoute,
    private animeService : AnimeServiceService,
    public loginService : LogInService,
    private formbuilder : FormBuilder) {

        this.rateForm = this.formbuilder.group({
          rating: ['', [Validators.required]]
        });

     }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const animeName: string = params.get('name');
      this.animeService.getAnimeByName(animeName).subscribe((anime) => {
        this.anime = anime[0];
      });
  });
  
}

public addToWish() {

  if(this.loginService.isUserLoggedIn()){
    this.animeService
    .addAnimeToWishlist(this.loginService.getLoggedInUserUsername(), this.anime.name).subscribe((res) => {
      console.log(res);
    });
  }

  this.animeService.AnimeWishlist(this.loginService.getLoggedInUserUsername()).subscribe((res) => {
    console.log(res);
  });

}

public addToWatched() {

  if(this.loginService.isUserLoggedIn()){
    this.animeService
    .addAnimeToWatchlist(this.loginService.getLoggedInUserUsername(), this.anime.name).subscribe();
  }

  this.animeService.AnimeWatchedlist(this.loginService.getLoggedInUserUsername()).subscribe((res) => {
    console.log(res);
  });

}

public rate(data) {
    console.log(data);
    this.thisUserRated = true;
    this.animeService.rateThisAnime(this.loginService.getLoggedInUserUsername(), this.anime.name, data['score']).subscribe();
}
    

}

