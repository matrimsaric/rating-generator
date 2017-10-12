
// src/app/login-page/login-page.component.ts
import { Component } from '@angular/core';
import { FirebaseService } from '../../../app-services/firebase.service';
import { Router } from "@angular/router";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
    
  constructor(public _firebase: FirebaseService, private router: Router) {}
  login() {
    // this._firebase.loginWithGoogle().then((data) => {
    //   // Send them to the homepage if they are logged in
    //   this.router.navigate(['']);
    // })
  }
}

