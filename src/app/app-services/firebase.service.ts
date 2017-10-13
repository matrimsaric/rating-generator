
// src/app/providers/af.ts
import {Injectable} from "@angular/core";
import { AngularFireDatabase } from 'angularfire2/database';//, FirebaseListObservable
import { AngularFireAuth, AngularFireAuthProvider } from 'angularfire2/auth';

import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

import { Player } from '../app-resources/spine/player';
// import { Scenario } from '../spine/scenario';
// import { Map } from '../spine/map';

@Injectable()
export class FirebaseService {

    private database: any;

  constructor(
      public af: AngularFireAuth, public _foreDatabase: AngularFireDatabase) 
  {
    this.database = this.af.app.database;

  }
  /**
   * Logs in the user
   * @returns {firebase.Promise<FirebaseAuthState>}
   */
  loginWithGoogle(): any {
    //return this.af.auth.signInAnonymously();

    return this.af.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    //this.af.auth.signInWithPopup(provider);
  }
  /**
   * Logs out the current user
   */
  logout() {
    return this.af.auth.signOut();
  }

  savePlayer(newUser: Player): void{
    let saveData: string = JSON.stringify(newUser);

    this.af.app.database().ref('players/'+newUser.id).set({
      saveData
    });
  }

  saveCompetition(newComp: any): void{
    let saveData: string = JSON.stringify(newComp);
    
        this.af.app.database().ref('competitions/'+newComp.id).set({
          saveData
        });
  }

  loadPlayer(playerId: number): any{
        var result: any;
        var recordReference: string = "players/"+playerId;
        // get all map data
        this.af.app.database().ref(recordReference).once('value').then(data => {
              return data.val();
          })
  }

//   saveScenario(saveScenario: Scenario): void{
//         let saveData: string = JSON.stringify(saveScenario);

//         this.af.app.database().ref('scenarios/' + saveScenario.id).set({
//             saveData
//         })
//   }

//   saveMap(saveMaps: string): void{

    
//         this.af.app.database().ref('maps/' + "1").set({
//             saveMaps
//         })
//   }

//   loadMaps(): Observable<string>{
//       var result: any;
//       // get all map data
//       this.af.app.database().ref('maps/1').once('value').then(data => {
//             return data.val().saveMaps;
//         });
//         return null;


//   }
}

