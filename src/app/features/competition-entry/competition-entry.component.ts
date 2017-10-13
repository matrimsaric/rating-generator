import { Component, OnInit } from '@angular/core';

import { FirebaseService } from '../../app-services/firebase.service';

@Component({
  selector: 'app-competition-entry',
  templateUrl: './competition-entry.component.html'
})
export class CompetitionEntryComponent implements OnInit {

    private dateEnd: string;
    private id: string;
    private name: string;
    private logo: string;
    
  constructor(private _firebase: FirebaseService) { }

  ngOnInit() {
  }

  private saveCompetition(): void{
    var compObject: any = {
      "name": this.name,
      "id": this.id,
      "logo": this.logo,
      "dateEnd": this.dateEnd
    };

    this._firebase.saveCompetition(compObject);

  }

}
