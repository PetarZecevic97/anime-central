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
  private animePics: string[] = [];

  constructor(private http: HttpClient) { 
      this.refreshAnime();

      this.animePics = [
        'http://localhost:3000/anime/picture/bleach',
        'http://localhost:3000/anime/picture/bleach',
        'http://localhost:3000/anime/picture/bleach',
        'http://localhost:3000/anime/picture/bleach',
        'http://localhost:3000/anime/picture/bleach',
        'http://localhost:3000/anime/picture/bleach',
        'http://localhost:3000/anime/picture/bleach',
        'http://localhost:3000/anime/picture/bleach',
        'http://localhost:3000/anime/picture/bleach',
        'http://localhost:3000/anime/picture/bleach'
      ]
  }

  refreshAnime(){
      this.animeList = this.http.get<Anime[]>(this.animeUrl);
      return this.animeList;
     }

  public getAnimeList() {
    return this.animeList;
  }

  /*public getAnimeById(id : number) {
    return this.animeList.((anime) => if(anime.id === id) return 0;)[0];
  }*/

  public getAnimePics() {
    return this.animePics;
  }
}
