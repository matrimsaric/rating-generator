import { ICellEditor, ICellEditorParams, ICellRenderer, CellEditorFactory } from 'ag-grid/main';

export class ClanLogoRenderer implements ICellRenderer {

    private params: any;
    htmlDiv: HTMLDivElement;

    init(params) {


        this.htmlDiv = document.createElement("div");
        this.htmlDiv.style.width = "100%";
        this.htmlDiv.style.height = "100%";
        this.htmlDiv.style.textAlign = "center";
        this.htmlDiv.style.verticalAlign = "middle";

        

        if (params.data.clan) {
            switch(params.data.clan){
                case 1:
                    this.htmlDiv.innerHTML = "<img src='/assets/images/clans/crabClan.png' style='height:20px'/>";
                break;
                case 2:
                    this.htmlDiv.innerHTML = "<img src='/assets/images/clans/craneClan.png' style='height:20px'/>";
                break;
                case 3:
                    this.htmlDiv.innerHTML = "<img src='/assets/images/clans/dragonClan.png' style='height:20px'/>";
                break;
                case 4:
                    this.htmlDiv.innerHTML = "<img src='/assets/images/clans/lionClan.png' style='height:20px'/>";
                break;
                case 5:
                    this.htmlDiv.innerHTML = "<img src='/assets/images/clans/phoenixClan.png' style='height:20px'/>";
                break;
                case 6:
                    this.htmlDiv.innerHTML = "<img src='/assets/images/clans/scorpionClan.png' style='height:20px'/>";
                break;
                case 7:
                    this.htmlDiv.innerHTML = "<img src='/assets/images/clans/unicornClan.png' style='height:20px'/>";
                break;
                default:
                    this.htmlDiv.innerHTML = "<img src='/assets/images/clans/neutralClan.png' style='height:20px'/>";
                break;
            }
           
        }
        else{
            this.htmlDiv.innerHTML = "<span style='width:20px'></span>";
        }
       

    }

    getGui() {
        return this.htmlDiv;
    }

    refresh(params: any): boolean {
        this.params = params;

        return true;
    }
}