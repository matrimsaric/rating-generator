import { Component, OnInit, Input } from '@angular/core';

import { Match } from '../../app-resources/spine/match';
import { Player } from '../../app-resources/spine/player';

import { GlobalService } from '../../app-services/global.service';

// language
import { Language, TranslationService } from 'angular-l10n';

@Component({
  selector: 'app-game-report',
  templateUrl: './game-report.component.html'
})
export class GameReportComponent implements OnInit {

  @Input() dispMatch: any;

  private match: Match;
  private player1: Player;
  private player2: Player;
  private player1Icon: string;
  private player2Icon: string;
  private player1Stats: string;
  private player2Stats: string;
  private result: string;

  constructor(private _translator: TranslationService,
            private _globals: GlobalService) { }

  ngOnInit() {

    this.player1 = this.dispMatch.player1;
    this.player2 = this.dispMatch.player2;
    this.match = this.dispMatch.match;
    this.buildData();
  }

  private buildData(): void{
    this.player1Stats = `[${this.player1.rating}]`;
    this.player2Stats = `[${this.player2.rating}]`;

    switch(this.match.result){
      case 0:
        this.result = this._translator.translate(" LOST ");
      break;
      case 1:
        this.result = this._translator.translate(" WON ");
      break;
      default:
        this.result = "?";
      break;
    }

    this.player1Icon = this._globals.getIconLink(this.player1.clanId);
    this.player2Icon = this._globals.getIconLink(this.player2.clanId);

    
  }

}
