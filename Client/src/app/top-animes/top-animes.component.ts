import { Component, OnInit } from '@angular/core';
import { Anime } from '../models/model.anime';
import { AnimeServiceService } from '../services/anime-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-animes',
  templateUrl: './top-animes.component.html',
  styleUrls: ['./top-animes.component.css']
})
export class TopAnimesComponent implements OnInit {


  public topAnimes : Anime[] = [];

  constructor(private animeService : AnimeServiceService,
              private router: Router) { 

    animeService.getMostPopularAnime(20).subscribe((res) => {            
      res.forEach( anime => {
        this.topAnimes.push(anime);
      }) 
    });

  }


  public shortDesc(desc : string){
    return desc.substring(0,150) + "...";
  }

  public redirectToAnime(animeName : string){
    this.router.navigate(["/anime/" + animeName]);
  }

  ngOnInit(): void {
  }

}
