import { Component, OnInit } from '@angular/core';

import { Player } from '../../app-resources/spine/player';
import { FirebaseService } from '../../app-services/firebase.service';

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

  constructor(private _translator: TranslationService,
                private _firebase: FirebaseService) { }

  ngOnInit() {
    // for debugging generate a test person to check field connections
    this.createTestPlayer();
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
        })

          
    }
}

  private getClanImage(): void{
      switch(this.player.clanId){
          case 1:
            this.currentClanImage = "/assets/images/champions/crabclanchampvertical.jpg";
            this.clanName = this._translator.translate("CRAB");
          break;
          case 2:
            this.currentClanImage = "/assets/images/champions/craneclanchampvertical.jpg";
            this.clanName = this._translator.translate("CRANE");
          break;
          case 3:
            this.currentClanImage = "/assets/images/champions/dragonclanchampvertical.jpg";
            this.clanName = this._translator.translate("DRAGON");
          break;
          case 4:
            this.currentClanImage = "/assets/images/champions/lionclanchampvertical.jpg";
            this.clanName = this._translator.translate("LION");
          break;
          case 5: 
            this.currentClanImage = "/assets/images/champions/phoenixclanchampvertical.jpg";
            this.clanName = this._translator.translate("PHOENIX");
          break;
          case 6:
            this.currentClanImage = "/assets/images/champions/scorpionclanchampvertical.jpg";
            this.clanName = this._translator.translate("SCORPION");
          break;
          case 7:
            this.currentClanImage = "/assets/images/champions/unicornclanchampvertical.jpg";
            this.clanName = this._translator.translate("UNICORN");
          break;
      }
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
