import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public SignUpForm: FormGroup;
  public SignUpSuccessful: boolean = false;

  constructor(private formBuilder: FormBuilder){ 
    
    this.SignUpForm = formBuilder.group({      
      email:    ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    
  }

  ngOnInit(): void {
  }

  public submitSignUpForm(formValue: any){
    this.SignUpSuccessful = true;

    //TODO: send request to server!
    return
  }


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
