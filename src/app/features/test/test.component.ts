import { Component, OnInit } from '@angular/core';

// import { glicko2 } from 'glicko2'
import * as glicko2 from 'glicko2';

import { PlayerService } from '../../app-services/player.service';
import { Player } from '../../app-resources/spine/player';
import { Match } from '../../app-resources/spine/match';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

    private settings = {
        tau: 0.5,
        rpd: 604800,
        rating: 1500,
        rd: 300,
        vol: 0.06
    };
    private glicko: any;
    private players: any[] = [];
    private p1: any;
    private p2: any;
    private p3: any;
    private p4: any;
    private p5: any;
    private p6: any;

    private errorMessage: string;

  constructor(private _players: PlayerService) { }

  ngOnInit() {
      this.glicko = new glicko2.Glicko2(this.settings);
        this.addPlayers();
        this.showRankings();

  }

  private loadPlayerStructure(players: Player[]): void{
    for(var i: number = 0; i < players.length; i++){
        var newp: any = this.glicko.makePlayer(players[i].rating, players[i].deviation, players[i].volatility);
        this.players.push({"id": players[i].id, "name": players[i].name,  glicko: newp});//
    }
  }

  private addPlayers(): void{
        this._players.loadPlayerData()
        .subscribe(allPlayers => this.loadPlayerStructure(allPlayers)),
        error => this.errorMessage = <any> error;
        

        // this.players = [
        //     { name: 'Ryan', glicko: this.p1},
        //     { name: 'Mary', glicko: this.p2},
        //     { name: 'Bob', glicko: this.p3},
        //     { name: 'John', glicko: this.p4},
        //     { name: 'Gaspard', glicko: this.p5},
        //     { name: 'Hector', glicko: this.p6},
        // ]
 
  }

  private showRankings(){
      //this.players.sort(function(pl1, pl2){return pl2.glicko.getRating() - pl1.glicko.getRating();})

      for(var i: number = 0; i < this.players.length; i++){
          var player: any = this.players[i];
          console.log(`[${player.id}] - ${player.name}: ${player.glicko.getRating()} (rd: ${player.glicko.getRd()})`);
      }

     
  }

  private loadMatchData(matchesMade: Match[]): void{

    var matches: any[] = [];
      for(var a: number = 0; a < matchesMade.length; a++){
        // get id
        var id1: number = matchesMade[a].id1;
        
        var foundIdOne: any = this.players.filter(playerRec => playerRec.id == matchesMade[a].id1);
        var foundIdTwo: any = this.players.filter(playerRec => playerRec.id == matchesMade[a].id2);

        
        
        if(foundIdOne && foundIdOne.length > 0 && foundIdTwo && foundIdTwo.length){
            var player1: any = foundIdOne[0];
            var player2: any = foundIdTwo[0];

            matches.push([player1.glicko, player2.glicko, matchesMade[a].result]);
        }

      }
    
    
    // matches.push([this.p1, this.p3, 1]);
    // matches.push([this.p1, this.p4,0]);
    // matches.push([this.p1, this.p2, 0]);

        this.glicko.updateRatings(matches);
        this.showRankings();
  }

  private forceComp1(): void{

    this._players.loadMatchesData()
    .subscribe(allMatches => this.loadMatchData(allMatches)),
    error => this.errorMessage = <any> error;



    // var matches: any[] = [];

    // matches.push([this.p1, this.p3, 1]);
    // matches.push([this.p1, this.p4,0]);
    // matches.push([this.p1, this.p2, 0]);

    // this.glicko.updateRatings(matches);
    // this.showRankings();
  }

  private forceComp2(): void{
 
    var matches: any[] = [];
    
        matches.push([this.p1, this.p5, 1]);
        matches.push([this.p6, this.p3,0]);
        matches.push([this.p4, this.p2, 0.5]);
        matches.push([this.p4, this.p1,0]);
        matches.push([this.p5, this.p2,0.5]);
        matches.push([this.p2, this.p4,0]);
    
        this.glicko.updateRatings(matches);
        this.showRankings();
  }

}
