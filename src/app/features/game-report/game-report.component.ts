import { Component, OnInit, Input } from '@angular/core';

import { Match } from '../../app-resources/spine/match';
import { Player } from '../../app-resources/spine/player';

import { GlobalService } from '../../app-services/global.service';
import { MESSAGE_REQUESTOR, MESSAGE_TYPE, MessagingService, MessageInformation} from '../../app-services/messaging.service';

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

  private currentLookup: MESSAGE_TYPE = MESSAGE_TYPE.UNKNOWN;

  constructor(private _translator: TranslationService,
            private _globals: GlobalService,
             private _messaging: MessagingService) { }

  ngOnInit() {

    this.player1 = this.dispMatch.player1;
    this.player2 = this.dispMatch.player2;
    this.match = this.dispMatch.match;
    this.buildData();
  }

  private buildData(): void{
    this.player1Stats = `(${this.player1.id})[${this.player1.rating}]`;
    this.player2Stats = `(${this.player2.id})[${this.player2.rating}]`;

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

  private showPlayer(tagid: any): void{
    console.log('show player has ticked');
    this.currentLookup = MESSAGE_TYPE.PLAYER_LOOKUP;

    var msg: MessageInformation = { "name": "dialogRequest", messageType: this.currentLookup,
                   details: this.player2.id, extra:[]};

    this._globals.playerLoadId = this.player2.id;
    this._messaging.sendMessage(msg);
  }

}
