import { Component, OnInit, Input } from '@angular/core';
import { Anime } from '../models/model.anime';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AnimeServiceService } from '../services/anime-service.service';
import { LogInService } from '../services/log-in.service';

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

  constructor(
    private route: ActivatedRoute,
    private animeService : AnimeServiceService,
    private loginService : LogInService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const animeName: string = params.get('name');
      this.animeService.getAnimeByName(animeName).subscribe((anime) => {
        this.anime = anime[0];
      });
  });
  
}

public addToWish() {

  /*if(this.loginService.isUserLoggedIn()){
    return this.animeService
    .addAnimeToWatchlist(this.loginService.loggedInUserUsername(), this.anime.name)
    .subscribe((msg) => {
      
    });
  }*/

  this.animeService.AnimeWatchlist(this.loginService.getLoggedInUserUsername()).subscribe((res) => {
    console.log(res);
  });

}
    

}

