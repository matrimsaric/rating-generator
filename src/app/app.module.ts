import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// services
import { MessagingService,FirebaseService, GlobalService,  PlayerService } from './app-services/index';

// our primary application routes
import {routing, appRoutingProviders } from './app-resources/app-routes/app-routes';

// third party
import { TranslationModule, LocaleService, TranslationService } from 'angular-l10n';
import { MaterialModule } from '@angular/material';
import { DialogDirective } from './app-resources/common/modal-dialog/dialog.directive';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AgGridModule } from "ag-grid-angular/main";


import { AppComponent } from './app.component';
import { TestComponent } from './features/test/test.component';
import { HomeComponent } from './features/admin/home/home.component';
import { ModalDialogComponent } from './app-resources/common/modal-dialog/modal-dialog.component';
import { LoginComponent } from './features/admin/login/login.component';
import { AddEditComponent } from './features/add-edit/add-edit.component';
import { AddResultComponent } from './features/add-result/add-result.component';
import { CompetitionEntryComponent } from './features/competition-entry/competition-entry.component';
import { GameReportComponent } from './features/game-report/game-report.component';
import { CurrentStandingsComponent } from './features/current-standings/current-standings.component';
import { PlayerReportComponent } from './features/player-report/player-report.component';
import { ControlPanelComponent } from './features/admin/control-panel/control-panel.component';


// must export the firebase config
export const firebaseConfig = {
  apiKey: "AIzaSyBIS6XyHpcPQmLXHuhA2p0cBrdr1rOTg54",
  authDomain: "lr5-league.firebaseapp.com",
  databaseURL: "https://lr5-league.firebaseio.com",
  projectId: "lr5-league",
  storageBucket: "lr5-league.appspot.com",
  messagingSenderId: "1025193056646"
};

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    HomeComponent,
    ModalDialogComponent,
    DialogDirective,
    LoginComponent,
    AddEditComponent,
    AddResultComponent,
    CompetitionEntryComponent,
    GameReportComponent,
    CurrentStandingsComponent,
    PlayerReportComponent,
    ControlPanelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule,
    routing,
    TranslationModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AgGridModule.withComponents([])
  ],
  entryComponents: [
      PlayerReportComponent
  ],
  providers: [
    TranslationService,
    MessagingService,
    GlobalService,
    PlayerService,
    FirebaseService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { 
    constructor(public locale: LocaleService, public translation: TranslationService) {
      
            this.locale.addConfiguration()
              .addLanguages(['en', 'it', 'de'])
              .setCookieExpiration(30)
              .defineLanguage('en');
      
              this.translation.addConfiguration()
              .addProvider('./assets/locale/locale-');
      
            this.translation.init();
    }
  }
