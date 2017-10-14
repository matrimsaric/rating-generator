import { Component, OnInit } from '@angular/core';

import { FirebaseService } from '../../app-services/firebase.service';
import { Player } from '../../app-resources/spine/player';
import { Match } from '../../app-resources/spine/match';
import { GameReportComponent } from '../game-report/game-report.component';

@Component({
  selector: 'app-add-result',
  templateUrl: './add-result.component.html',
  styles: [ './add-result.component.css']
})
export class AddResultComponent implements OnInit {

    private competitionId: string = "";
    private competitionName: string = "";
    private competitionRound: string = "General";
    private playerOne: Player = new Player();
    private playerTwo: Player = new Player();
    private player1Won: any;
    private draw: any;
    private matchList: Match[] = [];// initialise here
    private displayMatchList: any[] = [];// holds match and supporting players for sub window to display

  constructor(private _firebase: FirebaseService) { }

  ngOnInit() {
  }

  private save(): void{
    console.log("implement save protection for when data not entered before save pressed");
    // generate match result then add to list (which will auto add to the report children)
    var newMatch: Match = new Match();
    newMatch.description = this.competitionRound;
    newMatch.id1 = this.playerOne.id;
    newMatch.id2 = this.playerTwo.id;
    if(this.player1Won == true){
      newMatch.result = 1;
    } else {
      newMatch.result = 0;
    }
    this.matchList.push(newMatch);
    var display: any = {
      "match": newMatch,
      "player1": this.playerOne,
      "player2": this.playerTwo
    };

    this.displayMatchList.push(display);

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
