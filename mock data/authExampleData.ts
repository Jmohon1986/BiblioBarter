import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

// @IonicPage()
@Component({
  selector: 'home-page',
  templateUrl: 'home.page.html'
})
export class SampleUsers {

    sampleUsers: any;

    constructor(public navCtrl: NavController) {

        this.sampleUsers = [{ 
          family_name: "Theriot",
          gender: "female",
          given_name: "Laura",
          locale: "en",
          name: "Laura Theriot",
          nickname: "laurafrancestheriot",
          picture: "https://lh5.googleusercontent.com/-uhzzI0LuR2M/AAAAAAAAAAI/AAAAAAAAAKw/Z_9cPaPYOO0/photo.jpg",
          sub: "google-oauth2|114526446460397805282",
          updated_at: "2019-03-14T23:55:43.269Z"
          }];

    }

}