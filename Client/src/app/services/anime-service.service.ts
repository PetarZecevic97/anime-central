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
       { currentUsername : cur_user,
        animeName : animeName}, {withCredentials : true});
  }

  public addAnimeToWishlist(cur_user : string, animeName : string) {
    return this.http.post('http://localhost:3000/addanimetowishlist',
     { currentUsername : cur_user,
      animeName : animeName},
      {withCredentials : true, observe: "response", responseType: "json"});
}

  public AnimeWishlist(cur_user : string) {
    return this.http.get<Anime[]>('http://localhost:3000/mywishlistanime' + '?currentUsername=' + cur_user, {withCredentials : true});
  }

  public getMostPopularAnime(n : number){
    var topNAnimeUrl = 'http://localhost:3000/anime/popularlist/' + n;
    return this.http.get<Anime[]>(topNAnimeUrl);
  }

//mywatchedanime
public AnimeWatchedlist(cur_user : string) {
  return this.http.get<Anime []>('http://localhost:3000/mywatchedanime' + '?currentUsername=' + cur_user, {withCredentials : true});
}

//myratedanime
public AnimeRatedList(cur_user : string) {
  return this.http.get<Anime []>('http://localhost:3000/myratedanime' + '?currentUsername=' + cur_user, {withCredentials : true});
}

///ratethisanime req.body.currentUsername, req.body.animeName, req.body.score
public rateThisAnime(cur_user : string, anime : string, scor : string){
  return this.http.post(this.address + 'ratethisanime', { currentUsername : cur_user, animeName : anime, score : scor}, {withCredentials : true});
}

///ratethisanime req.body.currentUsername, req.body.animeName, req.body.commeny
public commentThisAnime(cur_user : string, anime : string, comm : string){
  return this.http.post(this.address + 'commentonthisanime', { currentUsername : cur_user, animeName : anime, comment : comm}, {withCredentials : true});
}




}
