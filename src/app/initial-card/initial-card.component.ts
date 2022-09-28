import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {GoogleApiResponse, Vocab} from "../api/api-model";
import {ConfigService} from "../api/config.service";
import {GoogleDictionaryService} from "../api/google-dictionary.service";
import {VocabStore} from "../store/vocab-store.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-initial-card',
  templateUrl: './initial-card.component.html',
  styleUrls: ['./initial-card.component.scss']
})
export class InitialCardComponent implements OnInit, OnDestroy {

  maxTextAreaColumnsForBarronMeaning = 60
  maxTextAreaColumnsForNotes = 60

  textAreaRowsForBarronMeaning = 1
  textAreaRowsForNotes = 1

  googleApiResponse: GoogleApiResponse[] = []

  googleApiResponseString = ''

  previousButtonPressState = 'LOL'

  subscription = new Subscription()
  otherSubscription = new Subscription()

  @Input()
  vocab: Vocab = {
    id: 'ID',
    word: 'NA',
    meaning: 'MEANING',
    familiarLevel: '0',
    trickySpell: false,
    trickyPronounce: false,
  };

  constructor(private configService: ConfigService, private googleDictionaryService: GoogleDictionaryService, private tempStore: VocabStore) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.otherSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.updateTextAreaRowsForNotes();
    this.updateTextAreaRowsForBarronMeaning();
    this.subscription.add(this.googleDictionaryService.getGoogleDictionaryMeaningByWord(this.vocab.word)
      .subscribe((response: GoogleApiResponse[]) => {
        this.googleApiResponse = response;
        this.googleApiResponseString = JSON.stringify(response, undefined, 2);
        console.log(`playing audio -> ${this.googleApiResponse[0].phonetics[0].audio}`)
        if(this.tempStore.playPhonetic$){
          this.googleDictionaryService.playPhoneticByWord(this.vocab.word);
        }
      }, error => {
        console.warn(error)
      }));
  }

  updateNotes() {
    this.updateTextAreaRowsForNotes();
    this.subscription.add(this.configService.patchVocab(this.vocab).subscribe());
  }

  updateBarronMeaning() {
    this.updateTextAreaRowsForBarronMeaning();
    this.subscription.add(this.configService.patchVocab(this.vocab).subscribe());
  }

  updateTextAreaRowsForNotes() {
    this.textAreaRowsForNotes = Math.ceil((this.vocab?.notes?.length ?? 1) / this.maxTextAreaColumnsForNotes)
  }

  updateTextAreaRowsForBarronMeaning() {
    this.textAreaRowsForBarronMeaning = Math.ceil((this.vocab?.meaning?.length ?? 1) / this.maxTextAreaColumnsForBarronMeaning)
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key == 'ArrowUp') {
      this.onArrowKeyPressed(parseInt(this.vocab.familiarLevel) + 1)
    } else if (event.key == 'ArrowDown') {
      this.onArrowKeyPressed(parseInt(this.vocab.familiarLevel) - 1)
    }
  }

  onArrowKeyPressed(score: string | number) {
    if (score < 0 || score > 10)
      return;
    this.vocab.familiarLevel = score.toString();
    this.subscription.add(this.configService.patchVocab(this.vocab).subscribe());
  }
}
