import { Routes, RouterModule } from '@angular/router';

// our module routes
import { TestComponent } from '../../features/test/test.component';
import { AddEditComponent } from '../../features/add-edit/add-edit.component';
import { AddResultComponent } from '../../features/add-result/add-result.component';
import { CompetitionEntryComponent } from '../../features/competition-entry/competition-entry.component';
import { HomeComponent } from '../../features/admin/home/home.component';
import { LoginComponent } from '../../features/admin/login/login.component';



const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'test', component: TestComponent },
    { path: 'addeditplayer', component: AddEditComponent },
    { path: 'addresults', component: AddResultComponent },
    { path: 'addcompetition', component: CompetitionEntryComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', component: HomeComponent }// will show when routing fails
];

export const appRoutingProviders: any[] = [
];

export const routing = RouterModule.forRoot(appRoutes);

