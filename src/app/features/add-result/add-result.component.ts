import { Component, OnInit } from '@angular/core';

import { FirebaseService } from '../../app-services/firebase.service';
import { Player } from '../../app-resources/spine/player';
import { Match } from '../../app-resources/spine/match';
import { GameReportComponent } from '../game-report/game-report.component';
import { MATCH_TYPE } from '../../app-resources/spine/match-type';

import * as glicko2 from 'glicko2';

// language
import { Language, TranslationService } from 'angular-l10n';

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
  private rounds: any[] = [];
     


  constructor(  private _firebase: FirebaseService,
                private _translate: TranslationService) { }

  ngOnInit() {

    this.glicko = new glicko2.Glicko2(this.settings);

    // count array
    //var rdCt: number = Object.keys(MATCH_TYPE).length/2;
    this.rounds.push({value: MATCH_TYPE.SWISS, name: this._translate.translate("SWISS")});
    this.rounds.push({value: MATCH_TYPE.SWISS_ROUND_1, name: this._translate.translate("SWISS_1")});
    this.rounds.push({value: MATCH_TYPE.SWISS_ROUND_2, name: this._translate.translate("SWISS_2")});
    this.rounds.push({value: MATCH_TYPE.SWISS_ROUND_3, name: this._translate.translate("SWISS_3")});
    this.rounds.push({value: MATCH_TYPE.SWISS_ROUND_4, name: this._translate.translate("SWISS_4")});
    this.rounds.push({value: MATCH_TYPE.SWISS_ROUND_5, name: this._translate.translate("SWISS_5")});
    this.rounds.push({value: MATCH_TYPE.SWISS_ROUND_6, name: this._translate.translate("SWISS_6")});
    this.rounds.push({value: MATCH_TYPE.SWISS_ROUND_7, name: this._translate.translate("SWISS_7")});
    this.rounds.push({value: MATCH_TYPE.SWISS_ROUND_8, name: this._translate.translate("SWISS_8")});
    this.rounds.push({value: MATCH_TYPE.TOP_132, name: this._translate.translate("TOP_132")});
    this.rounds.push({value: MATCH_TYPE.TOP_64, name: this._translate.translate("TOP_64")});
    this.rounds.push({value: MATCH_TYPE.TOP_32, name: this._translate.translate("TOP_32")});
    this.rounds.push({value: MATCH_TYPE.TOP_16, name: this._translate.translate("TOP_16")});
    this.rounds.push({value: MATCH_TYPE.QUATER_FINALS, name: this._translate.translate("QUATER_FINALS")});
    this.rounds.push({value: MATCH_TYPE.SEMI_FINALS, name: this._translate.translate("SEMI_FINALS")});
    this.rounds.push({value: MATCH_TYPE.FINALS, name: this._translate.translate("FINALS")});
    
    
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
      "player2": newp2,
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

      this._firebase.af.app.database().ref(idReference).once('value').then(data => {
        var comp: any =  JSON.parse(data.val().saveData);
        this.buildList(comp);

    });
          
    }
  }

  private buildList(data: any): void{
    this.matchList = [];
    this.displayMatchList = [];

    // // repair work
    // for(var index:number = 0; index < data.length; index++){
    //     if(data[index].player1.id == 209 && data[index].player2.id == 139){

    //       var save2 = data[index].player2;
    //       data[index].player2 = data[index].player1;
    //       data[index].player1 = save2;
    //       data[index].match.id1 = 139;
    //       data[index].match.id2 = 209;
    //     }
        //     // if(data[index].player1.id == 218){
        //         data[index].player1.id = 176;
        //         // data[index].player1.tag = "Sotomatic";
        //         data[index].player1.rating = 1724.0896031808043;
        //         data[index].player1.deviation = 231.84253471537815;
        //         data[index].match.id1 = 176;
        //         // data[index].player1.clanId = 5;
        //         console.log('A1 ' + JSON.stringify(data[index].player1.toString()));
        //     }
        //     if(data[index].player2.id == 218){
        //         data[index].player2.id = 176;
        //         // data[index].player2.tag = "Sotomatic";
        //         data[index].player2.rating = 1724.0896031808043;
        //         data[index].player2.deviation = 231.84253471537815;
        //         // data[index].player2.clanId = 5;
        //         data[index].match.id2 = 176;
        //         console.log('B1 ' +  JSON.stringify(data[index].player2.toString()));
        //     }
        // }
      }
        
    //     else if(data[index].player1.id == 176 || data[index].player2.id == 176){
    //         if(data[index].player1.id == 176){
    //             // data[index].player1.id = 192;
    //             // data[index].player1.tag = "Tenerim";
    //             data[index].player1.rating = 1724.0896031808043;
    //             data[index].player1.deviation = 231.84253471537815;
    //             // data[index].match.id1 = 192;
    //             // data[index].player1.clanId = 4;
    //             console.log('C ' +  JSON.stringify(data[index].toString()));
    //         }
    //         if(data[index].player2.id == 176){
    //             // data[index].player2.id = 192;
    //             // data[index].player2.tag = "Tenerim";
    //             data[index].player2.rating = 1724.0896031808043;
    //             data[index].player2.deviation = 231.84253471537815;
    //             // data[index].match.id2 = 192;
    //             // data[index].player2.clanId = 4;
    //             console.log('D ' +  JSON.stringify(data[index].toString()));
    //         }
    //     }
        
    // }

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
          this.playerOne.deviation = play.deviation;
          this.playerOne.rating = play.rating;
     
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
          this.playerTwo.deviation = play.deviation;
          this.playerTwo.rating = play.rating;
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

      this.updateIndividualPlayerRankings();
    }
  }

  private updateIndividualPlayerRankings(): void{
    // loop the players and change old rating to new rating
    for(var i: number = 0; i < this.players.length; i++){
      var currPlayer = this.players[i];
      // find the actual player record
      var recordReference: string = "players/"+this.players[i].id;
      // get all map data
      this._firebase.af.app.database().ref(recordReference).once('value').then(data => {
          var play: any =  JSON.parse(data.val().saveData);
          var tempPlayer: Player = new Player();

          tempPlayer.id = +play.id;
          tempPlayer.clanId = play.clanId;
          tempPlayer.tag = play.tag;
          tempPlayer.name = play.name;

          // save old values
          tempPlayer.oldRating = play.rating;
          tempPlayer.oldDeviation = play.deviation;

          // get players glicko!
          var foundPlayer: any = this.players.filter(playerRec => playerRec.id == tempPlayer.id);

          if(foundPlayer){
              // set new values
              tempPlayer.rating = foundPlayer[0].glicko.getRating();
              tempPlayer.deviation = foundPlayer[0].glicko.getRd();
              this._firebase.savePlayer(tempPlayer);
              console.log(`${tempPlayer.tag}  -  ${foundPlayer[0].glicko.getRating()}`);

              // get list of matches
              var foundMatches: any = this.displayMatchList.filter(matchRec => matchRec.player1.id == tempPlayer.id || matchRec.player2.id == tempPlayer.id);
              if(foundMatches){
                console.log(foundMatches);

                // now switch matches so that current player is always on the left hand side
                for(var f:number = 0; f < foundMatches.length; f++){
                    if(foundMatches[f].player1.id != tempPlayer.id){
                        var sav1 = foundMatches[f].player1;
                        var sav2 = foundMatches[f].player2;
                        foundMatches[f]["compeitionid"] = this.competitionId;// needed to prevent overwrites

                        foundMatches[f].player1 = sav2;
                        foundMatches[f].player2 = sav1;

                        foundMatches[f].match.id1 = sav2.id;
                        foundMatches[f].match.id2 = sav1.id;
                        if(foundMatches[f].match.result == 0){
                            foundMatches[f].match.result = 1;
                        }
                        else{
                            foundMatches[f].match.result = 0;
                        }
                        
                    }
                }
                // note only current live player matches are saved =- this prevents data bloat
                // as time passes.
                //this._firebase.savePlayerMatchResults(foundMatches, tempPlayer.id.toString(), this.competitionId);
              }


              
              
          }

          
        })
    }
  }

  private rollBackPlayerRatings(): void{

    this.loadPlayerStructure();


    for(var i: number = 0; i < this.players.length; i++){
      // find the actual player record
      var recordReference: string = "players/"+this.players[i].id;
      // get all map data
      this._firebase.af.app.database().ref(recordReference).once('value').then(data => {
          var play: any =  JSON.parse(data.val().saveData);
          var tempPlayer: Player = new Player();

          tempPlayer.id = +play.id;
          tempPlayer.clanId = play.clanId;
          tempPlayer.tag = play.tag;
          tempPlayer.name = play.name;

          // reset to old values
          tempPlayer.rating = play.oldRating;
          tempPlayer.deviation = play.oldDeviation;

          this._firebase.savePlayer(tempPlayer);
        })
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

      for(var i: number = 0; i < this.players.length; i++){
          var player: any = this.players[i];
          console.log(`[${player.id}] - ${player.name}: ${player.glicko.getRating()} (rd: ${player.glicko.getRd()})`);
      }

      
  }

  private clearAll(): void{
    this.matchList = [];
    this.displayMatchList = [];
  }




}
