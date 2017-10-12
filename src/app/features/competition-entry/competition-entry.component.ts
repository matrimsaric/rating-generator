import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-competition-entry',
  templateUrl: './competition-entry.component.html'
})
export class CompetitionEntryComponent implements OnInit {

    private dateEnd: string;
    private id: string;
    private name: string;
    private logo: string;
    
  constructor() { }

  ngOnInit() {
  }

}
