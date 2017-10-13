import { Component, OnInit } from '@angular/core';

import { FirebaseService } from '../../app-services/firebase.service';
import { Player } from '../../app-resources/spine/player';

@Component({
  selector: 'app-add-result',
  templateUrl: './add-result.component.html',
  styles: [ './add-result.component.css']
})
export class AddResultComponent implements OnInit {

    private competitionId: string = "";
    private competitionName: string = "";
    private playerOne: Player = new Player();
    private playerTwo: Player = new Player();
    private player1Won: any;
    private draw: any;

  constructor(private _firebase: FirebaseService) { }

  ngOnInit() {
  }

  private onCompetitionIdEnter(): void{
    if(this.competitionId){
      var recordReference: string = "competitions/"+this.competitionId;
      // get all map data
      this._firebase.af.app.database().ref(recordReference).once('value').then(data => {
          var comp: any =  JSON.parse(data.val().saveData);
          this.competitionName = comp.name;

      });
          
    }
  }

  private onPlayerOneEnter(): void{
    if(this.playerOne && this.playerOne.id){
      var recordReference: string = "players/"+this.playerOne.id;
      // get all map data
      this._firebase.af.app.database().ref(recordReference).once('value').then(data => {
          var play: any =  JSON.parse(data.val().saveData);
          this.playerOne = new Player();
          this.playerOne.id = +play.id;
          this.playerOne.clanId = play.clanId;
          this.playerOne.tag = play.tag;
     
        })

          
    }
    
  }

  private onPlayerTwoEnter(): void{
    if(this.playerTwo && this.playerTwo.id){
      var recordReference: string = "players/"+this.playerTwo.id;
      // get all map data
      this._firebase.af.app.database().ref(recordReference).once('value').then(data => {
          var play: any =  JSON.parse(data.val().saveData);
          this.playerTwo = new Player();
          this.playerTwo.id = +play.id;
          this.playerTwo.clanId = play.clanId;
          this.playerTwo.tag = play.tag;
     
        })

          
    }
  }

}
