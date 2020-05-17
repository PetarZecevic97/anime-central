import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { Anime } from '../models/model.anime';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimeServiceService {

  private readonly animeUrl = 'http://localhost:3000/anime/';
  private animeList: Observable<Anime[]>;

  constructor(private http: HttpClient) { 
      this.refreshAnime();
  }

  refreshAnime(){
      this.animeList = this.http.get<Anime[]>(this.animeUrl);
      return this.animeList;
     }

  public getAnimeList() {
    return this.animeList;
  }
}
