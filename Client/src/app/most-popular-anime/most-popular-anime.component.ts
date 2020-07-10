import { Component, OnInit } from '@angular/core';
import { Anime } from '../models/model.anime';
import { AnimeServiceService } from '../services/anime-service.service';
import { identity, Observable } from 'rxjs';

@Component({
  selector: 'app-most-popular-anime',
  templateUrl: './most-popular-anime.component.html',
  styleUrls: ['./most-popular-anime.component.css']
})
export class MostPopularAnimeComponent implements OnInit {  

  public mostPopularAnime : Anime[] = [];


  constructor(private animeService : AnimeServiceService) {

    animeService.getMostPopularAnime(20).subscribe((res) => {            
      res.forEach( anime => {
        this.mostPopularAnime.push(anime);
      }) 
    });

    

  }

  ngOnInit(): void {
  }

}
