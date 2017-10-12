import { Component, OnInit } from '@angular/core';

import { Player } from '../../app-resources/spine/player';
import { Clan } from '../../app-resources/spine/clan';
import { PlayerService } from '../../app-services/player.service';

// language
import { Language, TranslationService } from 'angular-l10n';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styles: []
})
export class AddEditComponent implements OnInit {

    @Language() lang: string;
    private player: Player = new Player();
    private clans: Clan[] = [];
    private errorMessage: string;
    private playerClan: Clan;
    private clanName: string;
    

  constructor   (private _players: PlayerService,
                private _translator: TranslationService) { }

  ngOnInit() {
        this._players.loadClansData()
        .subscribe(allClans => this.loadClans(allClans)),
        error => this.errorMessage = <any> error;
  }

  private loadClans(allClans: any): void{
      // ensure clan name is translated correctly
      for(var i: number = 0; i < allClans.length; i++){
        allClans[i].name = this._translator.translate(allClans[i].name);
      }

      this.clans = allClans;
  }

  private changeClan(newClan: Clan): void{
      this.player.clanId = newClan.id;

      
      this.clanName = this._translator.translate(newClan.name);
      this.getClan(newClan.id);
  }

  private getClan(currClanId: number): void{
    var foundClan: any = this.clans.filter(clanRec => clanRec.id == currClanId);

    if(foundClan && foundClan.length > 0){
        this.playerClan = foundClan[0];
    }
    else {
        var foundClan: any = this.clans.filter(clanRec => clanRec.id == -1);
        this.playerClan = foundClan;
    }
  }

  

}
