import { Component, OnInit } from '@angular/core';

import { FirebaseService } from '../../app-services/firebase.service';
import { GlobalService } from '../../app-services/global.service';
import { Player } from '../../app-resources/spine/player';
import { Match } from '../../app-resources/spine/match';
import { GameReportComponent } from '../game-report/game-report.component';

import * as glicko2 from 'glicko2';

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
    private compCommitted: boolean;

    private settings = {
      tau: 0.5,
      rpd: 604800,
      rating: 1500,
      rd: 300,
      vol: 0.06
  };
  private glicko: any;
  private players: any[] = [];

  constructor(  private _firebase: FirebaseService,
                private _globals: GlobalService) { }

  ngOnInit() {

    this.glicko = new glicko2.Glicko2(this.settings);


  }

  private add(): void{
    console.log("implement save protection for when data not entered before save pressed");
    
    var newp1 = new Player();
    newp1.clanId = this.playerOne.clanId;
    newp1.id = this.playerOne.id;
    newp1.rating = this.playerOne.rating;
    newp1.deviation = this.playerOne.deviation;
    newp1.volatility = this.playerOne.volatility;
    newp1.tag = this.playerOne.tag;

    var newp2 = new Player();
    newp2.clanId = this.playerTwo.clanId;
    newp2.id = this.playerTwo.id;
    newp2.rating = this.playerTwo.rating;
    newp2.deviation = this.playerTwo.deviation;
    newp2.volatility = this.playerTwo.volatility;
    newp2.tag = this.playerTwo.tag;
    // generate match result then add to list (which will auto add to the report children)
    var newMatch: Match = new Match();
    newMatch.description = this.competitionRound;
    newMatch.id1 = +newp1.id;
    newMatch.id2 = +newp2.id;
    if(this.player1Won == true){
      newMatch.result = 1;
    } else {
      newMatch.result = 0;
    }
    this.matchList.push(newMatch);

    

    var display: any = {
      "match": newMatch,
      "player1": newp1,
      "player2": newp2
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
          this.compCommitted = comp.committed;
      });

      // also try and load any results
      var idReference: string = "competition-results/"+this.competitionId;

      if(this._globals.savedResults){
          this.buildList(this._globals.savedResults);
      }
      else{
        this._firebase.af.app.database().ref(idReference).once('value').then(data => {
            var comp: any =  JSON.parse(data.val().saveData);
            this.buildList(comp);
    
        });
      }

      
          
    }
  }

  private buildList(data: any): void{
    this.matchList = [];
    this.displayMatchList = [];

    // set globals so we dont (potentially) have to reload
    this._globals.savedResults = data;

    this.displayMatchList = data;
    for(var c: number = 0; c < data.length; c++){
      this.matchList.push(data[c].match);
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

  private save(): void{
    //this.displayMatchList = this.displayMatchList.slice(0, 172);
    this._firebase.saveCompetitionResults(this.displayMatchList, this.competitionId);
  }

  private commit(): void{
    if(!this.compCommitted){
      // competition has not been committed yet we can begin
      // first up add glicko level players
      this.loadPlayerStructure();

      this.compareMatchData();
    }
  }


  private loadPlayerStructure(): void{
    for(var i: number = 0; i < this.displayMatchList.length; i++){
        var p1: Player = this.displayMatchList[i].player1;
        var p2: Player = this.displayMatchList[i].player2;

        var foundOne: any = this.players.filter(playerRec => playerRec.id == p1.id);
        
        if(foundOne.length == 0){
          var newp: any = this.glicko.makePlayer(p1.rating, p1.deviation, p1.volatility);
          this.players.push({"id": +p1.id, "name": p1.tag,  glicko: newp});//
        }
        

        
        var foundTwo: any = this.players.filter(playerRec => playerRec.id == p2.id);

        if(foundTwo.length == 0){
          var newp2: any = this.glicko.makePlayer(p2.rating, p2.deviation, p2.volatility);
          this.players.push({"id": +p2.id, "name": p2.tag,  glicko: newp2});//
        }

        
    }
  }

  private compareMatchData(): void{
    
        var matches: any[] = [];
          for(var a: number = 0; a < this.matchList.length; a++){
            
            var foundIdOne: any = this.players.filter(playerRec => playerRec.id == this.matchList[a].id1);
            var foundIdTwo: any = this.players.filter(playerRec => playerRec.id == this.matchList[a].id2);
            
            if(foundIdOne && foundIdOne.length > 0 && foundIdTwo && foundIdTwo.length){
                var player1: any = foundIdOne[0];
                var player2: any = foundIdTwo[0];
    
                matches.push([player1.glicko, player2.glicko, +this.matchList[a].result]);
            }
    
          }
    
          this.glicko.updateRatings(matches);
          this.showRankings();
    }

    private showRankings(){
      //this.players.sort(function(pl1, pl2){return pl2.glicko.getRating() - pl1.glicko.getRating();})
      var recordReference: string = "players";
      
       this._firebase.af.app.database().ref(recordReference).once('value').then(data => {
         this.trackPlayerRatingChanges(data);
         
    
       });

     

      
  }

  private clearAll(): void{
    this.matchList = [];
    this.displayMatchList = [];
  }

  private loadAllPlayers(): void{
   
  }

  private trackPlayerRatingChanges(data: any): void{
    for(var i: number = 0; i < data.length; i++){
      var play: any =  JSON.parse(data[i].val().saveData);

      // get the current player
      var found: any = this.players.filter(playerRec => playerRec.id == play.id);
      var glicko: any = found[0].glicko;
      
      var player: Player = new Player();
      
      player.id = +play.id;
      player.clanId = play.clanId;
      player.tag = play.tag;
      player.oldRating = play.rating;
      player.oldDeviation = play.deviation;
      player.rating = glicko.getRating();
      player.deviation = glicko.getRd();
  
      console.log(`[${player.id}] - ${player.tag}: ${glicko.getRating()} (rd: ${glicko.getRd()})`);
   }
    

   

    //this._firebase.savePlayer(player);
    
  }


}
