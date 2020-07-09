import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { strict } from 'assert';

@Injectable({
  providedIn: 'root'
})
export class LogInService {

  private readonly logInUrl = 'http://localhost:3000/login/';
  private readonly logOutUrl = 'http://localhost:3000/logout/';


  private loggedInUserCookies;

  private loggedinUserUsername : string; // username ulogovanog korisnika
  private userLoggedIn = false;          // da li je korisnik ulogovan
  private errorMsg : string;             // greska pri logovanju koju server vraca
  private areThereErrors = false;         // da li je server vratio gresku (greska se hvata u anonimnoj fji prilikom pretplate na tok odgovora)
  
  constructor(private http: HttpClient,
              private router: Router) {

  }
  
  //-------Service API-------------//
  public loggedInUserUsername(){
    return this.loggedinUserUsername;
  }
    
  public isUserLoggedIn(){
    return this.userLoggedIn;
  }

  public isErros(){
    return this.areThereErrors;
  }

  public errorMessage(){
    return this.errorMsg;
  }
  //-----------------------------//



  //-----------------HTTP Zahtevi----------------------------//

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

                      this.router.navigate(['/']);

                    }else{                                          
                      this.loggedinUserUsername = undefined;
                      this.userLoggedIn = false;
                    }

                  }, errorObj => {
                      //console.log(errorObj.message + "\n" + errorObj.error);
                      this.errorMsg = errorObj.message + "\n" + errorObj.error;
                      this.areThereErrors = true;
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
