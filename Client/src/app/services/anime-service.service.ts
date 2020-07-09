import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import { Anime } from '../models/model.anime';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AnimeServiceService {

  private readonly address = 'http://localhost:3000/'
  private readonly animeUrl = 'http://localhost:3000/anime/';
  private animeList: Observable<Anime[]>;

  constructor(private http: HttpClient, private cookie: CookieService) { 
      this.refreshAnime();
  }

  refreshAnime(){
      this.animeList = this.http.get<Anime[]>(this.animeUrl);
      return this.animeList;
     }

  public getAnimeList() {
    return this.animeList;
  }

  public getAnimeByName(Name : string) {
    return this.http.get<Anime>(this.animeUrl + Name);
  }
  
  public addAnimeToWatchlist(cur_user : string, animeName : string) {
      return this.http.post('http://localhost:3000/addanimetowatchedlist',
       { "currentUsername" : cur_user,
        "animeName" : animeName}, {withCredentials : true});
  }

  public AnimeWatchlist(cur_user : string) {
    return this.http.get('http://localhost:3000/mywishlistanime' + '?currentUsername=aca', {withCredentials : true});
}

}
