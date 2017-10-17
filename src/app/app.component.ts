import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from "@angular/router";

import { MessageInformation, MESSAGE_TYPE, MessagingService, MESSAGE_REQUESTOR } from './app-services/messaging.service';
import { GlobalService } from './app-services/global.service';
import { FirebaseService } from './app-services/firebase.service';
import { Subscription } from 'rxjs/rx';

// modal parent and dialogues to load
import { ModalDialogComponent } from './app-resources/common/modal-dialog/modal-dialog.component';
// import { SetComponent } from './features/lookups/set/set.component';
// import { ProducerComponent } from './features/lookups/producer/producer.component';
// import { NationalityComponent } from './features/lookups/nationality/nationality.component';

import { Language, TranslationService, LocaleService } from 'angular-l10n';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'app works!';
  @Language() lang: string;
  @ViewChild(ModalDialogComponent) modal: ModalDialogComponent;
  displayedLocale: string = "";

  private liveDialog: MESSAGE_REQUESTOR = MESSAGE_REQUESTOR.UNKNOWN;
  private isLoggedIn: boolean = false;
  private broadcastSubscription: Subscription;
  private loggedInUser: string = "";

  constructor(public localization: TranslationService,
               private locale: LocaleService,
              private _messenger: MessagingService,
              private _firebase: FirebaseService,
              private _router: Router,
              private _globals: GlobalService){
                switch(this.locale.getCurrentLocale()){
                  case "it":
                    this.displayedLocale = "ITALIAN";
                  break;
                  case "en":
                    this.displayedLocale = "ENGLISH";
                  break;
                  case "de":
                    this.displayedLocale = "GERMAN";
                  break;
                }
  }

  ngOnInit(): void{
    this.broadcastSubscription = this._messenger.broadcastMessage.subscribe(message => this.onMessageReceived(message));

    this._firebase.loginWithGoogle();
        this.isLoggedIn = true;
    this._firebase.af.authState.subscribe(
        (auth) => {
          if(auth == null) {
            console.log("Not Logged in.");
            this._router.navigate(['login']);
            this.isLoggedIn = false;
          }
          else {
            console.log("Successfully Logged in.");
            this.isLoggedIn = true;
            this.loggedInUser = auth.displayName;
            // UPDATE: I forgot this at first. Without it when a user is logged in and goes directly to /login
            // the user did not get redirected to the home page.
            this._router.navigate(['']);
          }
        }
      );
  }

  ngOnDestroy(): void{
    this.broadcastSubscription.unsubscribe();
  }

  private logout() {
      this.loggedInUser = "";
      this.isLoggedIn = false;
    // this._firebase.logout();
  }

  private onMessageReceived(message: MessageInformation): void{

    // switch(message.messageType){
    //   case MESSAGE_TYPE.OPEN_SET_DIALOG:
    //     this.liveDialog = message.details;
    //     this.modal.modalTitle = this.localization.translate("SELECT_SET");
    //     this.modal.passThroughData = message.details;// will contain a ref to the calling class.
    //     this.modal.okButton = true;
    //     this.modal.modalWidth = 500;
    //     this.modal.cancelButton = false;
    //     this.modal.modalMessage = true;
    //     this.modal.open(SetComponent);// pass in a component to populate the modal
    //   break;
    //   case MESSAGE_TYPE.OPEN_PRODUCER_DIALOG:
    //     this.liveDialog = message.details;
    //     this.modal.modalTitle = this.localization.translate("SELECT_PRODUCER");
    //     this.modal.passThroughData = message.details;// will contain a ref to the calling class.
    //     this.modal.okButton = true;
    //     this.modal.modalWidth = 500;
    //     this.modal.cancelButton = false;
    //     this.modal.modalMessage = true;
    //     this.modal.open(ProducerComponent);// pass in a component to populate the modal
    //   break;
    //   case MESSAGE_TYPE.OPEN_NATIONALITY_DIALOG:
    //     this.liveDialog = message.details;
    //     this.modal.modalTitle = this.localization.translate("SELECT_NATIONALITY");
    //     this.modal.passThroughData = message.details;// will contain a ref to the calling class.
    //     this.modal.okButton = true;
    //     this.modal.modalWidth = 500;
    //     this.modal.cancelButton = false;
    //     this.modal.modalMessage = true;
    //     this.modal.open(NationalityComponent);// pass in a component to populate the modal
    // break;
    // }
  }

  private modalOutput($event): void{
    // get response from modal then generate a message so the calling frame can pick up the rsults
    // var msg: MessageInformation = { name: this.liveDialog, messageType:MESSAGE_TYPE.DIALOG_RESULT, details: this._globals.dialogResult , extra: [] };
    // this._messenger.sendMessage(msg);
  }

      // *********************************** Language Methods ***********************************************
  // gets the current country.
  get currentCountry(): string {
    
        return this.locale.getCurrentCountry();
    
      }
    
      loadBaseLocale(userLanguage: string): void{
        var lang: string = userLanguage.substring(0,2);
        var country: string = userLanguage.substring(2,2);
    
        this.locale.setCurrentLanguage(lang);
        
        // note currency is not tracked, if we ever use currency then this will also need to be held within the relevant tables
        this.displayedLocale = country;
    
    
      }
    
      // sets a new locale & currency.
      selectLocale(language: string, country: string, currency: string, selectionText: string): void {
        // page will translate to new language automatically and without refreshing 
        // the power of pipes...
        this.locale.setCurrentLanguage(language);
        this.locale.setCurrentCurrency(currency);
        this.displayedLocale = country;
      }
}
