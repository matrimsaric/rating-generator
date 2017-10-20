import { Component, OnInit } from '@angular/core';

// ag-grid
import { AgGridNg2, BaseComponentFactory } from 'ag-grid-angular/main';
import { GridOptions, ColDef, RangeSelection, GridCell, ICellRenderer, ICellRendererParams, ICellRendererFunc, ICellEditor, RowNode } from 'ag-grid/main';

import { GlobalService } from '../../../app-services/global.service';
import { MESSAGE_REQUESTOR, MESSAGE_TYPE, MessagingService, MessageInformation} from '../../../app-services/messaging.service';

import { FirebaseService } from '../../../app-services/firebase.service';
import { Player } from '../../../app-resources/spine/player';

// language
import { Language, TranslationService } from 'angular-l10n';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styles: []
})
export class ControlPanelComponent implements OnInit {

    @Language() lang: string;
    private gridRows: any[] = []; // row data is passed as is to ag-grid
    public columnDefs: any[] = []; // ag-grid column definitions
    public gridOptions: GridOptions; // ag-grid options
    private rank: number = 1;

    private currentLookup: MESSAGE_TYPE = MESSAGE_TYPE.UNKNOWN;

  constructor(  private _translate: TranslationService,
                private _firebase: FirebaseService,
                private _globals: GlobalService,
                private _messaging: MessagingService) { 
  }

  ngOnInit() {
      this.loadPlayerBase();

      this.createColumnsDefs();
      
      this.gridOptions = <GridOptions>{
          enableColResize: true,
          enableSorting: true,
          enableFilter: true,
          groupHeaders: true,
          enableRangeSelection: true,
          rowSelection: "multiple",
          toolPanelSuppressGroups: true,
          toolPanelSuppressValues: true,
          debug: false,
          columnDefs: this.columnDefs,
          groupUseEntireRow: true
  
      };
      
  }

  private loadPlayerBase(): void{
    // load individual players and add to base list array
    var empty: boolean = false;
    var playerCount: number = 0;
    var tempArray: any[] = [];


    for(var i: number = 1; i < 107; i++){
        
        //playerCount += 1;
        var recordReference: string = "players/"+i;
        // get all map data
        this._firebase.af.app.database().ref(recordReference).once('value').then(data => {
            var play: any =  JSON.parse(data.val().saveData);
            //console.log('loading' + i + " for player " + play.id + " tag " + play.tag);
            var newRow: any = {"id": play.id, "name": play.name, "tag": play.tag, "rating": play.rating,
                "deviation": play.deviation, "clan": play.clanId, "active": true, "lastupdated": "20171810",
                "oldDeviation": play.oldDeviation, "oldRating": play.oldRating };

            this.gridRows.push(newRow);

            if(play.id == 106){
                this.gridOptions.api.setRowData(this.gridRows);
            }
           
          });

          
    }

  }

  private onCellValueChanged($event): void{
    if ($event.newValue == $event.oldValue) {
        return;
    }
    // collect current row and then save to database
    var adjustedPlayer: Player = new Player();

    adjustedPlayer.id = $event.data["id"];
    adjustedPlayer.name = $event.data["name"];
    adjustedPlayer.tag = $event.data["tag"];
    adjustedPlayer.clanId = $event.data["clan"];
    adjustedPlayer.deviation = $event.data["deviation"];
    adjustedPlayer.rating = $event.data["rating"];
    adjustedPlayer.oldDeviation = $event.data["oldDeviation"];
    adjustedPlayer.oldRating = $event.data["oldRating"];
    adjustedPlayer.volatility = 0.6;
    adjustedPlayer.oldVolatility = 0.6;
    adjustedPlayer.active = $event.data["active"];
    adjustedPlayer.lastActive = $event.data["lastActive"];
    
    // now save to firebase replacing current
    console.log('test player formulation ')
    this._firebase.savePlayer(adjustedPlayer);

  }

  private createColumnsDefs() {
        this.columnDefs = [
            {
                headerName: this._translate.translate("ID"),
                field: 'id',
                width: 60,
            },
            {
                headerName: this._translate.translate("NAME"),
                field: "name",
                editable: true,
                width: 150,
            },
            {
                headerName: this._translate.translate("CLAN"),
                field: "clan",
                editable: true,
                width: 90,
            },
            {
                headerName: this._translate.translate("TAG"),
                field: "tag",
                editable: true,
                width: 150,
            },
            {
                headerName: this._translate.translate("RATING"),
                field: "rating",
                editable: true,
                width: 120,
            },
            {
                headerName: this._translate.translate("DEVIATION"),
                field: "deviation",
                editable: true,
                width: 120,
            },
            {
                headerName: this._translate.translate("OLD_RATING"),
                field: "oldRating",
                editable: true,
                width: 120,
            },
            {
                headerName: this._translate.translate("OLD_DEVIATION"),
                field: "oldDeviation",
                editable: true,
                width: 120,
            },
            {
                headerName: this._translate.translate("ACTIVE"),
                field: "active",
                editable: true,
                width: 120,
            },
            {
                headerName: this._translate.translate("LAST_ACTIVE"),
                field: "lastActive",
                editable: true,
                width: 120,
            }
        ];
    }

    private onCellDoubleClicked($event): void{
        this.currentLookup = MESSAGE_TYPE.PLAYER_LOOKUP;
    
        var msg: MessageInformation = { "name": "dialogRequest", messageType: this.currentLookup,
                       details: $event.node.data.id, extra:[]};
    
        this._globals.playerLoadId = $event.node.data.id;
        this._messaging.sendMessage(msg);
    }

  

    


}
