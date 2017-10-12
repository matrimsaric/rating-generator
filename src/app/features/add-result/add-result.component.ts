import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-result',
  templateUrl: './add-result.component.html',
  styles: [ './add-result.component.css']
})
export class AddResultComponent implements OnInit {

    private competitionId: string = "";
    private competitionName: string = "";
    private player1Id: string = "";
    private player2Id: string = "";
    private player1Won: any;
    private draw: any;

  constructor() { }

  ngOnInit() {
  }

}
