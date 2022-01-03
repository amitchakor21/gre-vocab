import {Component, HostListener, Input, OnInit} from '@angular/core';
import {GoogleApiResponse, Vocab} from "../api/api-model";
import {ConfigService} from "../api/config.service";
import {GoogleDictionaryService} from "../api/google-dictionary.service";

@Component({
  selector: 'app-initial-card',
  templateUrl: './initial-card.component.html',
  styleUrls: ['./initial-card.component.scss']
})
export class InitialCardComponent implements OnInit {

  maxTextAreaColumnsForBarronMeaning = 60
  maxTextAreaColumnsForNotes = 60

  textAreaRowsForBarronMeaning = 1
  textAreaRowsForNotes = 1

  googleApiResponse: GoogleApiResponse[] = [{
    meanings: [], phonetics: [], word: ''
  }]

  googleApiResponseString = ''

  previousButtonPressState = 'LOL'

  @Input()
  vocab: Vocab = {
    id: 'ID',
    word: 'NA',
    meaning: 'MEANING'
  };

  constructor(private configService: ConfigService, private googleDictionaryService: GoogleDictionaryService) {
  }

  ngOnInit(): void {
    this.updateTextAreaRowsForNotes();
    this.updateTextAreaRowsForBarronMeaning();
    this.googleDictionaryService.getGoogleDictionaryMeaningByWord(this.vocab.word)
      .subscribe((response: GoogleApiResponse[]) => {
        this.googleApiResponse = response;
        this.googleApiResponseString = JSON.stringify(response, undefined, 2);
        this.googleDictionaryService.playPhonetic(response[0].phonetics[0].audio);
      }, error => {
        console.warn(error)
      });
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
    if (this.previousButtonPressState == event.key) {
      if (parseInt(event.key)) {
        this.onNumberPressedTwice(event.key)
      } else if (event.key == '0') {
        this.onNumberPressedTwice('10')
      } else if (event.key == '`') {
        this.onNumberPressedTwice('0')
      }
    }
    this.previousButtonPressState = event.key
  }

  onNumberPressedTwice(score: string) {
    this.vocab.familiarLevel = score;
    this.configService.patchVocab(this.vocab).subscribe();
  }
}
