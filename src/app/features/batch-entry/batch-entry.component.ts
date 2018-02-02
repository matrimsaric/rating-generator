import { Component, OnInit } from '@angular/core';
import { last } from 'rxjs/operator/last';

import { FirebaseService } from '../../app-services/firebase.service';
import { Player } from '../../app-resources/spine/player';
import { GameReportComponent } from '../game-report/game-report.component';
import { MATCH_TYPE } from '../../app-resources/spine/match-type';

import * as glicko2 from 'glicko2';

import { Match } from '../../app-resources/spine/match';

@Component({
  selector: 'app-batch-entry',
  templateUrl: './batch-entry.component.html',
  styles: []
})
export class BatchEntryComponent implements OnInit {

  private textEntry: string = "www";
  private winEntries: Match[] = [];
  private lossEntries: Match[] = [];
  private committingEntries: Match[] = [];
  private failureEntries: Match[] = [];
  private playerArray: Map<string, Player> = new Map();
  private playerGlickoArray: Map<string, string> = new Map();
  private matchList: Match[] = [];// initialise here

  private glicko: any;

  private players: any[] = [];
  private rounds: any[] = [];

  private settings = {
    tau: 0.5,
    rpd: 604800,
    rating: 1500,
    rd: 300,
    vol: 0.06
};

  constructor(private _firebase: FirebaseService) { }

  ngOnInit() {
    this.glicko = new glicko2.Glicko2(this.settings);
    
  }

  prepare(): void {
      this.winEntries = [];
      this.lossEntries = [];
      this.committingEntries = [];
      this.failureEntries = [];

      // take list and split into lines.
      var initialArray: any[];

      initialArray = this.textEntry.split("\n");

      // generate a record for each and if record has two entries then add to the valid list
      if(initialArray && initialArray.length > 0){
        for(var a:number = 0; a < initialArray.length; a++){
            // comma delimited list so split again
            var localResultArray: any[];

            localResultArray = initialArray[a].split(',');

            var newMatch = new Match();
            newMatch.description = 'batch';
            newMatch.id1 = localResultArray[0];
            newMatch.id2 = localResultArray[2];
            newMatch.result = localResultArray[1];

            if(newMatch.result == 1){
                this.winEntries.push(newMatch);
            } else {
                this.lossEntries.push(newMatch);
            }
        }

        // now we have win/loss check that all wins have a related loss
        for(var b: number = 0; b < this.winEntries.length; b++){
            if(this.searchForEquivelantMatch(this.winEntries[b], this.lossEntries)){
                this.committingEntries.push(this.winEntries[b]);
            } else{
                this.failureEntries.push(this.winEntries[b]);
            }
        }

        // repeat for losses except here we dont add to committing as win entry 
        // will already have covered it
        for(var b: number = 0; b < this.lossEntries.length; b++){
            if(this.searchForEquivelantMatch(this.lossEntries[b], this.winEntries)){
                
            } else{
                this.failureEntries.push(this.lossEntries[b]);
            }
        }
        

      }

      // once valid list is generated then load the relevant players and matches
      for(var d:number = 0; d < this.committingEntries.length; d++){
          console.log(`Player id ${this.committingEntries[d].id1} beat ${this.committingEntries[d].id2}`);
          this.loadPlayer(this.committingEntries[d].id1);
          this.loadPlayer(this.committingEntries[d].id2);
      }

      // then commit the same way as the slower results window


      // show errors
      for(var d:number = 0; d < this.failureEntries.length; d++){
        console.log(`Player id ${this.failureEntries[d].id1} has no equivelant record ${this.failureEntries[d].id2}`);
    }
  }

  commit(): void{
    var matches: any[] = [];
    this.loadPlayerStructure();

    for(var d:number = 0; d < this.committingEntries.length; d++){
        // for each entry to load loop, get players and generate correct gicko
        var foundIdOne: any = this.players.filter(playerRec => playerRec.id == this.committingEntries[d].id1);
        var foundIdTwo: any = this.players.filter(playerRec => playerRec.id == this.committingEntries[d].id2);
        
        if(foundIdOne && foundIdOne.length > 0 && foundIdTwo && foundIdTwo.length){
            var player1: any = foundIdOne[0];
            var player2: any = foundIdTwo[0];

            matches.push([player1.glicko, player2.glicko, +this.committingEntries[d].result]);
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

  private searchForEquivelantMatch(source: Match, searchArray: Match[]): boolean{
    var res: boolean = false;

    for(var c:number = 0; c < searchArray.length; c++ ){
        if(searchArray[c].id1 == source.id2 && searchArray[c].id2 == source.id1){
            res = true;
            break;
        }
    }

    return res;
  }

  private loadPlayer(recordReference): void{
      
    if(this.playerArray.get(recordReference) != null){
        // got it do nothing
    } else{
        var dbReference: string = "players/"+recordReference;
        var loadedPlayer: Player; 1
        this._firebase.af.app.database().ref(dbReference).once('value').then(data => {
            var play: any =  JSON.parse(data.val().saveData);
            loadedPlayer = new Player();
            loadedPlayer.id = +play.id;
            loadedPlayer.clanId = play.clanId;
            loadedPlayer.tag = play.tag;
            loadedPlayer.deviation = play.deviation;
            loadedPlayer.rating = play.rating;

            if(this.playerArray.get(recordReference) == null){
                this.playerArray.set(recordReference, loadedPlayer);
            }
        
      })
    }
    
  }


  private loadPlayerStructure(): void{
    for(var i: number = 0; i < this.committingEntries.length; i++){
        var p1: Player =  this.playerArray.get(this.committingEntries[i].id1.toString());
        var p2: Player = this.playerArray.get(this.committingEntries[i].id2.toString());

        if(this.playerGlickoArray.get(p1.id.toString())){

        } else{
            var newp: any = this.glicko.makePlayer(p1.rating, p1.deviation, p1.volatility);
            this.players.push({"id": +p1.id, "name": p1.tag,  glicko: newp});

            this.playerGlickoArray.set(p1.id.toString(), p1.id.toString());
        }

        if(this.playerGlickoArray.get(p2.id.toString())){

        } else{
            var foundTwo: any = this.players.filter(playerRec => playerRec.id == p2.id);

            if(foundTwo.length == 0){
            var newp2: any = this.glicko.makePlayer(p2.rating, p2.deviation, p2.volatility);
            this.players.push({"id": +p2.id, "name": p2.tag,  glicko: newp2});//
            }
        }

        
 
        

        
        

        
    }
  }

  

}
