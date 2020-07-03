import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LogInService {

  private readonly logInUrl = 'http://localhost:3000/login/';

  private readonly user = "";
  private response;

  constructor(private http: HttpClient) {

  }
  
  //fja za dohvatanje korisnickog imena trenutno logovanog korisnika
  public currentUserUsername(){
    return this.user;
  }
   

  public logIn(username : string, password : string){
   
   this.http.post(this.logInUrl, 
                  {username: username, password: password}, 
                  {observe: "body", responseType: "json"}).subscribe((res) =>{
                    console.log(res);
                  });

  }


}
