import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

import { Player } from '../app-resources/spine/player';
import { Match } from '../app-resources/spine/match';
import { Clan } from '../app-resources/spine/clan';

import { FirebaseService } from './firebase.service';

@Injectable()
export class PlayerService {

 private _playerUrl = '/assets/test-files/players.json';
 private _matchUrl = '/assets/test-files/results.json';
 private _clanUrl = '/assets/other/clans.json';

 private errorMessage: string = "";

  constructor(  private _http: Http,
                private _firebase: FirebaseService  ) { }

  public loadPlayerData() : Observable<Player[]> {
    return this._http.get(this._playerUrl)
        .map((response: Response) => <Player[]>response.json())
        // .do(data => console.log("RopeData: " + JSON.stringify(data)))
        .catch(error => this.handleError(error));
  }

  public loadMatchesData() : Observable<Match[]> {
    return this._http.get(this._matchUrl)
        .map((response: Response) => <Match[]>response.json())
        // .do(data => console.log("RopeData: " + JSON.stringify(data)))
        .catch(error => this.handleError(error));
  }

  public loadClansData() : Observable<Clan[]> {
    return this._http.get(this._clanUrl)
        .map((response: Response) => <Clan[]>response.json())
        // .do(data => console.log("RopeData: " + JSON.stringify(data)))
        .catch(error => this.handleError(error));
  }

  public savePlayer(newPlayer: Player): void{
    this._firebase.savePlayer(newPlayer);
  }

  


 

  private handleError(error: any){
    // translate error message into valid json
     var retError: any = error;
     var retErrorBody: any = JSON.parse(retError._body);

    
    
    return Observable.throw(error.json().error || 'Server error');
    }

    

}
