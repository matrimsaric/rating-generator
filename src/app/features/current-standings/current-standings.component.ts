import { Component, OnInit } from '@angular/core';

// ag-grid
import { AgGridNg2, BaseComponentFactory } from 'ag-grid-angular/main';
import { GridOptions, ColDef, RangeSelection, GridCell, ICellRenderer, ICellRendererParams, ICellRendererFunc, ICellEditor, RowNode } from 'ag-grid/main';
import { ClanLogoRenderer } from './clan-logo.renderer';

// language
import { Language, TranslationService } from 'angular-l10n';

@Component({
  selector: 'app-current-standings',
  templateUrl: './current-standings.component.html',
  styles: []
})
export class CurrentStandingsComponent implements OnInit {

   @Language() lang: string;
   private gridRows: any[]; // row data is passed as is to ag-grid
   public columnDefs: any[] = []; // ag-grid column definitions
   public gridOptions: GridOptions; // ag-grid options
   private rank: number = 1;

  constructor(private _translate: TranslationService) { 
    this.gridRows = [
        {"id": 45, "name": "bob", "tag": "HUZZAH", "rating": 1789, "deviation": 250, "clan": 1},
        {"id": 34, "name": "teresa", "tag": "MUTHER", "rating": 2019, "deviation": 150, "clan": 2},
        {"id": 67, "name": "fred", "tag": "groupie", "rating": 1789, "deviation": 200, "clan": 3},
        {"id": 123, "name": "ginny", "tag": "luvs", "rating": 1233, "deviation": 50, "clan": 4},
        {"id": 87, "name": "maximus", "tag": "dalord", "rating": 1500, "deviation": 300, "clan": 5},
        {"id": 54, "name": "graham", "tag": "flyingmuppets", "rating": 1400, "deviation": 100, "clan": 6},
        {"id": 90, "name": "james", "tag": "riders", "rating": 1290, "deviation": 300, "clan": 7},
        {"id": 122, "name": "frank", "tag": "jog", "rating": 1655, "deviation": 144, "clan": 3},
        {"id": 156, "name": "clare", "tag": "allluvs", "rating": 1987, "deviation": 200, "clan": 4},
        {"id": 344, "name": "anthony", "tag": "strong", "rating": 1134, "deviation": 40, "clan": 5},
        {"id": 32, "name": "jake", "tag": "great", "rating": 1223, "deviation": 112, "clan": 6},
        {"id": 65, "name": "bianca", "tag": "sith lord", "rating": 1765, "deviation": 345, "clan": 7},
        {"id": 87, "name": "steff", "tag": "jug", "rating": 1566, "deviation": 266, "clan": 1},
        {"id": 900, "name": "louis", "tag": "hmmm", "rating": 1487, "deviation": 250, "clan": 2}

    ]

  }

  ngOnInit() {
      this.createColumnsDefs();

    this.gridOptions = <GridOptions>{
        enableColResize: true,
        enableSorting: true,
        enableFilter: true,
        groupHeaders: true,
        toolPanelSuppressGroups: true,
        toolPanelSuppressValues: true,
        debug: false,
        columnDefs: this.columnDefs,
        groupUseEntireRow: true,
        onGridReady: (params) => {
            this.setupRowData();
            this.gridOptions.api.setRowData(this.gridRows);
        },

    };
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
                editable: false,
                width: 150,
            },
            {
                headerName: this._translate.translate("CLAN"),
                field: "clan",
                editable: false,
                cellRenderer: ClanLogoRenderer,
                width: 90,
            },
            {
                headerName: this._translate.translate("TAG"),
                field: "tag",
                editable: false,
                width: 150,
            },
            {
                headerName: this._translate.translate("RATING"),
                field: "rating",
                editable: false,
                width: 120,
            },
            {
                headerName: this._translate.translate("DEVIATION"),
                field: "deviation",
                editable: false,
                width: 120,
            },
            {
                headerName: this._translate.translate("PLACEMENT"),
                field: "globalPosition",
                editable: false,
                width: 120,
            },
            {
                headerName: this._translate.translate("95_BAND"),
                field: "ninetyFive",
                editable: false,
                width: 120,
            }
        ];
    }

  

    private setupRowData(): boolean {
        var internalCount = 0;
        var dataSet: boolean = true;
        this.rank = 1;

        if(this.gridRows  && this.gridRows != null && this.gridRows.length > 0){
            for (var gridRow of this.gridRows) {
                // calc rating on the fly.
                // this will be actual rating times 10 MINUS the deviation
                if(gridRow["rating"]){
                    var rat: number = +gridRow["rating"];
                    var dev: number = +gridRow["deviation"];
                    var rankRat: number = (rat * 10) - dev;
                    gridRow["globalPosition"] = rankRat;

                    // above is its deviation adjusted rank now we also need the 95% band
                    var lower: number = rat - (dev*2);
                    var higher: number = rat + (dev*2);

                    var ninetyFive: string = `[${lower}:${higher}]`;
                    gridRow["ninetyFive"] = ninetyFive;
                }

                
                this.rank += 1;
            }
            this.gridOptions.rowData = this.gridRows;
        }
        else{
            dataSet = false;
        }

        return dataSet;
        

    }


}
