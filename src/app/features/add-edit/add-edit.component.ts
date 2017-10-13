import { Component, OnInit } from '@angular/core';

import { Player } from '../../app-resources/spine/player';
import { Clan } from '../../app-resources/spine/clan';
import { PlayerService } from '../../app-services/player.service';
import { FirebaseService } from '../../app-services/firebase.service';


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
                private _translator: TranslationService,
                private _firebase: FirebaseService) { }

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
    this.clanName = this._translator.translate(this.playerClan.name);
  }

  private savePlayer(): void{
      this._players.savePlayer(this.player);
      //this.player = new Player();
  }

  private forward(): void{
      if(!this.player.id && this.player.id < 1){
          this.player.id = 1;
      } else{
          this.player.id = this.player.id + 1;
      }

      this.onIdEnter();
  }

  private back(): void{
    if(this.player.id < 1){
        this.player.id = 1;
    } else{
        this.player.id = this.player.id - 1;
    }

    this.onIdEnter();
}

  private onIdEnter(): void{
      // when enter pressed on an id field IF the id is set then attempt
      // to load that id
      if(this.player && this.player.id){
        var recordReference: string = "players/"+this.player.id;
        // get all map data
        this._firebase.af.app.database().ref(recordReference).once('value').then(data => {
            var play: any =  JSON.parse(data.val().saveData);
            this.player = new Player();
            this.player.id = +play.id;
            this.player.clanId = play.clanId;
            this.player.tag = play.tag;
            this.getClan(this.player.clanId);       
          })

            
      }

      
  }



  

}
