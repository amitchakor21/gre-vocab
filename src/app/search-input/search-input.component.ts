import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {VocabStore} from "../store/vocab-store.service";
import {PrimeNGConfig} from "primeng/api";
import {RegexSelection} from "../api/api-model";
import {Subscription} from "rxjs";

const regexSelections = [
  {name: 'contains', prefix: '.*', suffix: '.*'},
  {name: 'starts with', prefix: '^', suffix: ''},
  {name: 'regex', prefix: '', suffix: ''},
];

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent implements OnInit, OnDestroy {

  regexSelections: RegexSelection[] = regexSelections;
  regexSelection: RegexSelection = regexSelections[0];

  subscription = new Subscription()

  constructor(readonly tempStore: VocabStore, private primengConfig: PrimeNGConfig) {
  }

  ngOnInit() {
    this.refresh()
    this.primengConfig.ripple = true;
    this.subscription.add(this.tempStore.vocabListSubject$.subscribe(vocabList => {
      if (vocabList.length) {
        this.total = vocabList[0]?.total ?? 0;
      }
    }))
    this.subscription.add(this.tempStore.pageNumberSubject$.subscribe(pageNumber => {
      this.pageNumber = pageNumber;
    }))
    this.tempStore.playPhonetic$.next(true);
  }

  word: string = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  score: string = '0-9'
  pageNumber: number = 0
  size: number = 1
  total: number = 0
  timerEnabled: boolean = false;
  playPhonetic: boolean = true;

  refresh() {
    document.title = 'PC ' + this.score;
    this.tempStore.refreshVocabsByParams({
      word: this.getWordRegex(),
      score: this.score,
      page: this.pageNumber,
      size: this.size
    });
  }

  private getWordRegex() {
    return this.regexSelection.prefix + this.word + this.regexSelection.suffix;
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key == 'ArrowRight') {
      this.tempStore.pageNumberSubject$.next(this.getNextPageNumber())
    }
    if (event.key == 'ArrowLeft') {
      this.tempStore.pageNumberSubject$.next(this.getPreviousPageNumber())
    }
  }

  getNextPageNumber(): number {
    return this.pageNumber == this.total - 1 ? 0 : this.pageNumber + 1
  }

  getPreviousPageNumber(): number {
    return this.pageNumber == 0 ? this.total - 1 : this.pageNumber - 1
  }

  refreshWordInput() {
    this.pageNumber = 0
    this.refresh();
  }

  async keepLoadingNext() {
    this.timerEnabled = !this.timerEnabled;
    while (this.timerEnabled) {
      await new Promise(resolve => setTimeout(resolve, 20000));
      this.tempStore.pageNumberSubject$.next(this.getNextPageNumber())
    }
  }

  playPhoneticFunction(){
    this.playPhonetic = !this.playPhonetic
    this.tempStore.playPhonetic$.next(this.playPhonetic);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
