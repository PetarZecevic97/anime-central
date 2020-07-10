import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { strict } from 'assert';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LogInService {

  private readonly logInUrl = 'http://localhost:3000/login/';
  private readonly logOutUrl = 'http://localhost:3000/logout/';


  private loggedinUserUsername : string; // username ulogovanog korisnika
  private userLoggedIn = false;          // da li je korisnik ulogovan
  private errorMsg : string;             // greska pri logovanju koju server vraca
  private areThereErrors = false;         // da li je server vratio gresku (greska se hvata u anonimnoj fji prilikom pretplate na tok odgovora)
  

  constructor(private http: HttpClient,
              private cookieService: CookieService,
              private router: Router) {


  }
  
  //-------Service API-------------//
  public getLoggedInUserUsername(){
    return this.loggedinUserUsername;
  }
    
  public isUserLoggedIn(){
    return this.userLoggedIn;
  }

  public isErrors(){
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

                    if(res.body['pericTrue'].hasOwnProperty("sessionSaved")){
                      
                      this.loggedinUserUsername = username;
                      this.userLoggedIn = true;
                      this.cookieService.set('loggedInUser', res.body['cookieValue']);
                      
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


  public logOut(){

    this.http.get(this.logOutUrl,
                  {withCredentials : true, observe : "response", responseType : "json"}
      ).subscribe((res) =>{
      

      if(res.body.hasOwnProperty("loggedOut")){
                
        this.loggedinUserUsername = undefined;
        this.userLoggedIn = false;

        // ovde pitam da li je bio na user page, ako jeste, redirekcija
        if (this.router.url === '/user') {
          this.router.navigate(['/']);  
        }

      }else if(res.body.hasOwnProperty("sessionExpired")){
          //ovde da se stavi neki alert prozor!!!
          //...
          this.router.navigate['/login'];          
      }
    }, errorObj => {
       window.alert(errorObj.message + "\n" + errorObj.error);
       this.router.navigate['/login'];
    });

  }

  //---------------------------------------------------------//

}
