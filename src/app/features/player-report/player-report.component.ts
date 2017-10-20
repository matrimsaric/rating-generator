import { Component, OnInit } from '@angular/core';

import { Player } from '../../app-resources/spine/player';
import { FirebaseService } from '../../app-services/firebase.service';
import { GlobalService } from '../../app-services/global.service';

import { GameReportComponent } from '../game-report/game-report.component';

// language
import { Language, TranslationService } from 'angular-l10n';

@Component({
  selector: 'app-player-report',
  templateUrl: './player-report.component.html'
})
export class PlayerReportComponent implements OnInit {

    @Language() lang: string;
    private player: Player;
    private suggestedRank: string;
    private clanName: string;
    private currentClanImage: string;
    private ninetyFive: string;
    private matches: any;
    private showImage: boolean = true;

  constructor(private _translator: TranslationService,
                private _firebase: FirebaseService,
                private _globals: GlobalService) { }

  ngOnInit() {
    // for debugging generate a test person to check field connections
    if(this._globals.playerLoadId != null){
        this.player = new Player();
        this.showImage = false;
        this.player.id = this._globals.playerLoadId;
        this.onPlayerEntry();
        this._globals.playerLoadId = null;
    } else{
        this.createTestPlayer();
    }
    
  }

  private createTestPlayer(): void{
    this.player = new Player();
    this.player.id = 12;
    this.player.clanId = 2;
    this.player.deviation = 233;
    this.player.name = "John Smith";
    this.player.oldDeviation = 255;
    this.player.oldRating = 1455;
    this.player.rating = 1677;
    this.player.tag = "KERRANG";
    this.calcRank();
    this.calcNinetyFivePercent();
    this.getClanImage();
  }

  private onPlayerEntry(): void{
    if(this.player && this.player.id){
      var recordReference: string = "players/"+this.player.id;
      // get all map data
      this._firebase.af.app.database().ref(recordReference).once('value').then(data => {
          var play: any =  JSON.parse(data.val().saveData);
          this.player = new Player();
          this.player.id = +play.id;
          this.player.clanId = play.clanId;
          this.player.tag = play.tag;
          this.player.deviation = play.deviation;
          this.player.name = play.name;
          this.player.oldDeviation = play.oldDeviation;
          this.player.oldRating = play.oldRating;
          this.player.oldVolatility = play.oldVolatility;
          this.player.rating = play.rating;
          this.player.volatility = play.volatility;

          this.calcRank();
          this.calcNinetyFivePercent();
          this.getClanImage();
        });

        // load matches as well
        var matchReference: string = "player-match-results/"+this.player.id;
        this._firebase.af.app.database().ref(matchReference).once('value').then(data => {
          this.matches = JSON.parse(data.val().saveData);
        });

          
    }
}

  private getClanImage(): void{
      switch(this.player.clanId){
          case 1:
            this.currentClanImage = "/assets/images/champions/crab.png";
            this.clanName = this._translator.translate("CRAB");
          break;
          case 2:
            this.currentClanImage = "/assets/images/champions/crane.jpg";
            this.clanName = this._translator.translate("CRANE");
          break;
          case 3:
            this.currentClanImage = "/assets/images/champions/dragon.png";
            this.clanName = this._translator.translate("DRAGON");
          break;
          case 4:
            this.currentClanImage = "/assets/images/champions/lion.png";
            this.clanName = this._translator.translate("LION");
          break;
          case 5: 
            this.currentClanImage = "/assets/images/champions/phoenix.png";
            this.clanName = this._translator.translate("PHOENIX");
          break;
          case 6:
            this.currentClanImage = "/assets/images/champions/scorpion.png";
            this.clanName = this._translator.translate("SCORPION");
          break;
          case 7:
            this.currentClanImage = "/assets/images/champions/unicorn.png";
            this.clanName = this._translator.translate("UNICORN");
          break;
      }
  }

  private forward(): void{
    if(!this.player.id && this.player.id < 1){
        this.player.id = 1;
    } else{
        this.player.id = this.player.id + 1;
    }

    this.onPlayerEntry();
}

    private back(): void{
    if(this.player.id < 1){
        this.player.id = 1;
    } else{
        this.player.id = this.player.id - 1;
    }

    this.onPlayerEntry();
    }

  private calcNinetyFivePercent(): void{
    var extremeDeviation: number = this.player.deviation * 2;
    var lowerBounds: number = this.player.rating - extremeDeviation;
    var upperBounds: number = this.player.rating + extremeDeviation;

    this.ninetyFive = `${this.player.rating} [${lowerBounds}:${upperBounds}]`;
  }

  private calcRank(): void{
    if(this.player){
        if(this.player.rating < 1200){
            this.suggestedRank = this._translator.translate("NOVICE");
        } 
        else if(this.player.rating >= 1200 && this.player.rating < 1400){
            this.suggestedRank = this._translator.translate("CLASS_D");
        }
        else if(this.player.rating >= 1400 && this.player.rating < 1600){
            this.suggestedRank = this._translator.translate("CLASS_C");
        }
        else if(this.player.rating >= 1600 && this.player.rating < 1800){
            this.suggestedRank = this._translator.translate("CLASS_B");
        }
        else if(this.player.rating >= 1800 && this.player.rating < 2000){
            this.suggestedRank = this._translator.translate("CLASS_A");
        }
        else if(this.player.rating >= 2000 && this.player.rating < 2200){
            this.suggestedRank = this._translator.translate("EXPERT");
        }
        else if(this.player.rating >= 2200 && this.player.rating < 2300){
            this.suggestedRank = this._translator.translate("CANDIDATE_MASTER");
        }
        else if(this.player.rating >= 2300 && this.player.rating < 2400){
            this.suggestedRank = this._translator.translate("MASTER");
        }
        else if(this.player.rating >= 2400 && this.player.rating < 2500){
            this.suggestedRank = this._translator.translate("SENIOR_MASTER");
        }
        else if(this.player.rating >= 2500 ){
            this.suggestedRank = this._translator.translate("GRAND_MASTER");
        }
    }
  }

}
