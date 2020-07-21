import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LogInService } from '../services/log-in.service';
import { inflateRawSync } from 'zlib';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {

  private readonly signUpUrl = "http://localhost:3000/signup/";

  public SignUpForm: FormGroup;
  public SignUpSuccessful: boolean = false;
  public errorMsg : string;
  public areThereErrors = false;

  private signUpSub;

  constructor(private formBuilder: FormBuilder,
              private http : HttpClient,
              private logInSevice : LogInService){ 
    
    this.SignUpForm = formBuilder.group({      
      email:    ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.signUpSub.unsubscribe();
  }

  //-----------HTTP Zahtev za pravljenje novog naloga------------------//
  public submitSignUpForm(formValue: any){
    
    var email = this.SignUpForm.get("email").value;
    var username = this.SignUpForm.get("username").value;
    var password = this.SignUpForm.get("password").value;

    this.signUpSub = this.http.post(this.signUpUrl,
      { email, username, password },
      { observe: "response", responseType: "json" })
      .subscribe((res) => {

        if (res.body.hasOwnProperty("insertUser")) {

          this.logInSevice.logIn(username, password);

        }


      }, errorObj => {
        this.areThereErrors = true;
        this.errorMsg = errorObj.error;
      });

  }
  //-------------------------------------------------------------------//


  public get email(){
    return this.SignUpForm.get('email');
  }
  public get username(){
    return this.SignUpForm.get('username');
  }
  public get password(){
    return this.SignUpForm.get('password');
  }

}
