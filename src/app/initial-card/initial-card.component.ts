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

  @Input()
  vocab: Vocab = {
    id: 'ID',
    word: 'NA',
    meaning: 'MEANING',
    familiarLevel: '0'
  };

  constructor(private configService: ConfigService, private googleDictionaryService: GoogleDictionaryService, private tempStore: VocabStore) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.updateTextAreaRowsForNotes();
    this.updateTextAreaRowsForBarronMeaning();
    this.subscription.add(this.googleDictionaryService.getGoogleDictionaryMeaningByWord(this.vocab.word)
      .subscribe((response: GoogleApiResponse[]) => {
        this.googleApiResponse = response;
        this.googleApiResponseString = JSON.stringify(response, undefined, 2);
        this.subscribeToPlayPhoneticBoolean();
      }, error => {
        console.warn(error)
      }));
  }

  private subscribeToPlayPhoneticBoolean() {
    this.subscription.add(this.tempStore.playPhonetic$.subscribe(playPhonetic => {
      if (playPhonetic) {
        this.googleDictionaryService.playPhonetic(this.googleApiResponse[0].phonetics[0].audio);
      }
    }))
  }

  onSlideEnd() {
    this.configService.patchVocab(this.vocab).subscribe();
  }

  updateNotes() {
    this.updateTextAreaRowsForNotes();
    this.configService.patchVocab(this.vocab).subscribe();
  }

  updateBarronMeaning() {
    this.updateTextAreaRowsForBarronMeaning();
    this.configService.patchVocab(this.vocab).subscribe();
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
      this.onNumberPressedTwice(parseInt(this.vocab.familiarLevel) + 1)
    } else if (event.key == 'ArrowDown') {
      this.onNumberPressedTwice(parseInt(this.vocab.familiarLevel) - 1)
    }
  }

  onNumberPressedTwice(score: string | number) {
    this.vocab.familiarLevel = score.toString();
    this.subscription.add(this.configService.patchVocab(this.vocab).subscribe());
  }
}
