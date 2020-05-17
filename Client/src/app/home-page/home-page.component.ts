import { Component, OnInit } from '@angular/core';
import { AnimeServiceService } from '../services/anime-service.service';
import { Anime } from '../models/model.anime';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  public AnimeList: Observable<Anime[]>;

  constructor(private animeService: AnimeServiceService) { 
    this.AnimeList = animeService.getAnimeList();
  }

  ngOnInit(): void {
  }

}
