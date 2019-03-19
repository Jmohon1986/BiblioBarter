import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { ApiService } from '../../api.service';
import { Auth0Cordova } from '@auth0/cordova'
import * as auth0 from 'auth0-js';

(window as any).global = window;

@Injectable()
export class AuthService {
// props
  username = '';

  isLoggedIn$ = new Subject();
  isLoggedIn: Boolean = false;
  auth0 = new auth0.WebAuth({
    clientID: 'ivIuyoWYphC-Rxf2AWNO6cl9HRID0X9x',
    domain: 'bibliobarter.auth0.com',
    responseType: 'token id_token',
    audience: 'https://bibliobarter.auth0.com/userinfo',
    redirectUri: 'http://localhost:8100/callback',
    scope: 'openid profile',
  });

//   client = new Auth0Cordova({
//     domain: 'YOUR_DOMAIN',
//     clientId: 'YOUR_CLIENT_ID',
//     packageIdentifier: 'YOUR_PACKAGE_ID' // found in config.xml
//   });

//   var options = {
//     scope: 'openid profile',
//     audience: 'https://YOUR_DOMAIN/userinfo'
//   };
//   var self = this;
//   client.authorize(options, function(err, authResult) {
//     if (err) {
//       console.log(err);
//       return (e.target.disabled = false);
//     }
//     localStorage.setItem('access_token', authResult.accessToken);
//     self.resumeApp();
//   });
// };

  constructor(public router: Router, public http: HttpClient, private apiService: ApiService) {
    // Check if user is logged In when Initializing
    const loggedIn = this.isLoggedIn = this.isAuthenticated();
    this.isLoggedIn$.next(loggedIn);
  }

  /** 
   * @function login
   * logs user in via auth0 when login button clicked
   */
  public login(): void {
    this.auth0.authorize();
  }

// when user is authenticated, access token is saved to local storage
// send get req to auth0 w that access token and recieve user info back
  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        const loggedIn = this.isLoggedIn = true;
        this.isLoggedIn$.next(loggedIn);
        this.router.navigate(['/Matches']);
        // console.log(localStorage);
        // http req here to /userinfo to grab user prof from Auth0
        this.http.get('https://bibliobarter.auth0.com/userinfo', { 
          headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${localStorage.access_token}`,}, 
      }).subscribe((userInfo: any) => {
        console.log(userInfo, 'USER');
        localStorage.setItem('username', userInfo.nickname);
        this.apiService.userSignup(userInfo);
      })

      } else if (err) {

        const loggedIn = this.isLoggedIn = false;
        this.isLoggedIn$.next(loggedIn);
        this.router.navigate(['/Greet']);
      }
      console.log(this.isLoggedIn);
    });
  }

  private setSession(authResult): void {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  // need to connect to logout button
    /** 
   * @function logout
   * logs user out via auth0 when login button clicked
   */
  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('username');
    localStorage.removeItem('userid');
    // Go back to the home route
    const loggedIn = this.isLoggedIn = false;
    this.isLoggedIn$.next(loggedIn);
  }

//  This method checks if the user is authenticated or not by checking the token expiration 
//  date from local storage.
  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
    return new Date().getTime() < expiresAt;
  }
}

// import { Injectable, NgZone } from '@angular/core';
// import { Observable, Subscription } from 'rxjs';

// import Auth0Cordova from '@auth0/cordova';
// import Auth0 from 'auth0-js';

// const auth0Config = {
//   // needed for auth0
//   clientID: 'YOUR_CLIENT_ID',

//   // needed for auth0cordova
//   clientId: 'YOUR_CLIENT_ID',
//   domain: 'YOUR_AUTH0_DOMAIN',
//   callbackURL: location.href,
//   packageIdentifier: 'YOUR_PACKAGE_ID'
// };

// @Injectable()
// export class AuthService {
//   auth0 = new Auth0.WebAuth(auth0Config);
//   accessToken: string;
//   idToken: string;
//   user: any;

//   constructor(public zone: NgZone) {
//     this.user = this.getStorageVariable('profile');
//     this.idToken = this.getStorageVariable('id_token');
//   }

//   private getStorageVariable(name) {
//     return JSON.parse(window.localStorage.getItem(name));
//   }

//   private setStorageVariable(name, data) {
//     window.localStorage.setItem(name, JSON.stringify(data));
//   }

//   private setIdToken(token) {
//     this.idToken = token;
//     this.setStorageVariable('id_token', token);
//   }

//   private setAccessToken(token) {
//     this.accessToken = token;
//     this.setStorageVariable('access_token', token);
//   }

//   public isAuthenticated() {
//     const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
//     return Date.now() < expiresAt;
//   }

//   public login() {
//     const client = new Auth0Cordova(auth0Config);

//     const options = {
//       scope: 'openid profile offline_access'
//     };

//     client.authorize(options, (err, authResult) => {
//       if(err) {
//         throw err;
//       }

//       this.setIdToken(authResult.idToken);
//       this.setAccessToken(authResult.accessToken);

//       const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
//       this.setStorageVariable('expires_at', expiresAt);

//       this.auth0.client.userInfo(this.accessToken, (err, profile) => {
//         if(err) {
//           throw err;
//         }

//         profile.user_metadata = profile.user_metadata || {};
//         this.setStorageVariable('profile', profile);
//         this.zone.run(() => {
//           this.user = profile;
//         });
//       });
//     });
//   }

//   public logout() {
//     window.localStorage.removeItem('profile');
//     window.localStorage.removeItem('access_token');
//     window.localStorage.removeItem('id_token');
//     window.localStorage.removeItem('expires_at');

//     this.idToken = null;
//     this.accessToken = null;
//     this.user = null;
//   }

// }