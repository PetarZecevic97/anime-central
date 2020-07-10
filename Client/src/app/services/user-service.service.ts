import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  private readonly userAnimeInfoUrl = "http://localhost:3000/useranimeinfo";

  constructor(private http: HttpClient) { 
    console.log("User service constructor!");
  }
}
