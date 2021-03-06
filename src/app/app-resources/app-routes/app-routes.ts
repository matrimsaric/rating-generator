import { Routes, RouterModule } from '@angular/router';

// our module routes
import { TestComponent } from '../../features/test/test.component';
import { AddEditComponent } from '../../features/add-edit/add-edit.component';
import { AddResultComponent } from '../../features/add-result/add-result.component';
import { CompetitionEntryComponent } from '../../features/competition-entry/competition-entry.component';
import { HomeComponent } from '../../features/admin/home/home.component';
import { LoginComponent } from '../../features/admin/login/login.component';
import { CurrentStandingsComponent } from '../../features/current-standings/current-standings.component';
import { PlayerReportComponent } from '../../features/player-report/player-report.component';
import { ControlPanelComponent } from '../../features/admin/control-panel/control-panel.component';
import { BatchEntryComponent } from '../../features/batch-entry/batch-entry.component';


const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'test', component: TestComponent },
    { path: 'addeditplayer', component: AddEditComponent },
    { path: 'addresults', component: AddResultComponent },
    { path: 'addcompetition', component: CompetitionEntryComponent },
    { path: 'playerreport', component: PlayerReportComponent },
    { path: 'currentstandings', component: CurrentStandingsComponent },
    { path: 'controlpanel', component: ControlPanelComponent },
    { path: 'batchentry', component: BatchEntryComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', component: HomeComponent }// will show when routing fails
];

export const appRoutingProviders: any[] = [
];

export const routing = RouterModule.forRoot(appRoutes);

