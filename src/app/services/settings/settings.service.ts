import { Injectable } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private auth: AuthService, private http: HttpClient) {}
  host = 'http://ec2-18-188-132-186.us-east-2.compute.amazonaws.com:3000';
  // local = 'http://localhost:3000';
  // local = 'http://ec2-18-188-132-186.us-east-2.compute.amazonaws.com:3000';
  local = 'http://18.216.108.229:3000';

  switchAccount() {
    const that = this;
    this.auth.logout();

    setTimeout(() => that.auth.login(), 1500);
  }

  /**
   * Updates a users university
   * @param school The university you are transferring / going to
   */
  changeSchool(school) {
    console.log(school);
    // debugger;
    this.http.patch(`${this.local}/school`, { 'school': school, 'userId': localStorage.userid })
      .subscribe(data => console.log(data, 'DATA YOU GET BACK FROM PATCH TO /SCHOOL'));
  }

  
  deleteAccount(username) {
    // this.http.delete('http://localhost:3000/delete', { params: { 'user': username } })
    console.log(`Why you do this, ${username}?`);
  }
}
