import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class LogInService {

  private readonly logInUrl = 'http://localhost:3000/login/';
  private readonly logOutUrl = 'http://localhost:3000/logout/';

  //private loggedInUserCookieValue;
  //private loggedInUserCookieName;

  private loggedInUserCookies;

  private loggedinUserUsername : string;
  private userLoggedIn = false;
  
  constructor(private http: HttpClient) {

  }
  
  public loggedInUserUsername(){
    return this.loggedinUserUsername;
  }
  
  public isUserLoggedIn(){
    return this.userLoggedIn;
  }



  public logIn(username : string, password : string){
   
   this.http.post(this.logInUrl, 
                  {username: username, password: password}, 
                  {observe: "response", responseType: "json"})
                  .subscribe((res) =>{
                    
                    if(res.body){
                      this.loggedinUserUsername = username;
                      this.userLoggedIn = true;
                      
                      //this.loggedInUserCookies = res.headers;

                      //this.loggedInUserCookies =  res.headers.get('Set-Cookie');
                      //console.log(this.loggedInUserCookies);

                    }else{
                      this.loggedinUserUsername = ":(((";
                      this.userLoggedIn = false;
                    }

                  });

  }

  //BUG 
  //TREBA POSLATI I KOLACICE O LOGAVNOM KORISNIKU!!
  public logOut(){

    this.http.get(this.logOutUrl
      ).subscribe((res) =>{
      
      if(res){
        this.loggedInUserUsername = undefined;
        this.userLoggedIn = false;        
      }else{
        //TODO:
        //mislim da ovde ne treba nista da se radi, ali neka je ova grana u slucaju da zatreba :D
        //mozda informacija o nekoj gresci
      }
    });




  }

}
