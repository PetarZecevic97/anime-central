import { Component, OnInit } from '@angular/core';
import { AnimeServiceService } from '../services/anime-service.service';
import { Anime } from '../models/model.anime';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main-body',
  templateUrl: './main-body.component.html',
  styleUrls: ['./main-body.component.css']
})
export class MainBodyComponent implements OnInit {

  public AnimeList: Observable<Anime[]>;

  constructor(private animeService: AnimeServiceService) { 
    this.AnimeList = animeService.getAnimeList();
  }

  ngOnInit(): void {
  }

}
