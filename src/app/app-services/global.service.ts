import { Injectable } from '@angular/core';

import { Player } from '../app-resources/spine/player';


@Injectable()
export class GlobalService {

  public dialogResult: any;
  public savedResults: any; // storage space for results
  public savedPlayers: Player[] = [];// storage space for players



  constructor() { }

  public getIconLink(clan: number): string{
    var result: string = "/assets/images/clans/neutralClan.png";

    switch(clan){
      case 1:
        result = "/assets/images/clans/crabClan.png";        
      break;
      case 2:
        result = "/assets/images/clans/craneClan.png"; 
      break;
      case 3:
        result = "/assets/images/clans/dragonClan.png"; 
      break;
      case 4:
        result = "/assets/images/clans/lionClan.png"; 
      break;
      case 5:
        result = "/assets/images/clans/phoenixClan.png"; 
      break;
      case 6:
        result = "/assets/images/clans/scorpionClan.png"; 
      break;
      case 7:
        result = "/assets/images/clans/unicornClan.png"; 
      break;
    }

    return result;
  }

}
