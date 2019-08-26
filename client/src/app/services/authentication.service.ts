import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as config from '../../assets/config';

declare var $: any;

export interface UserDetails {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  exp: number;
  iat: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone: string;
  otp: string;
  requested_otp_on: string;
}

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  private token: string;


  constructor(private http: HttpClient, private router: Router) {}

  private request(method: 'post'|'get', type: 'login'|'register'|'profile'|'verify'|'sendotp'|'forgot'|'reset'|'verifyemail', user?: TokenPayload): Observable<any> {
    let base;
    if (method === 'post') {
      base = this.http.post(config.host+`/api/${type}`, user);
    } else {
      base = this.http.get(config.host+`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
    }
    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );
    return request;
  }
  private saveToken(token: string): void {
    localStorage.setItem('chunk-token', token);
    this.token = token;
  }

  public getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('chunk-token');
    }
    return this.token;
  }

  public logout(): void {
    $('.router-container').hide();
    this.token = '';
    window.localStorage.removeItem('chunk-token');
    document.location.href = '';
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  public register(user: TokenPayload): Observable<any> {
    return this.request('post', 'register', user);
  }

  public resendotp(user: TokenPayload): Observable<any> {
    return this.request('post', 'sendotp', user);
  }

  public login(user: TokenPayload): Observable<any> {
    return this.request('post', 'login', user);
  }

  public verify(user: TokenPayload): Observable<any> {
    return this.request('post', 'verify', user);
  }
  public verifyEmail(user: TokenPayload): Observable<any> {
    return this.request('post', 'verifyemail', user);
  }
  public forgot(user: TokenPayload): Observable<any> {
    return this.request('post', 'forgot', user);
  }

  public reset(user: TokenPayload,resetToken): Observable<any> {
    return this.http.post(config.host+'/api/reset/'+resetToken, user);
  }

  public profile(): Observable<any> {
    return this.request('get', 'profile');
  }
}


