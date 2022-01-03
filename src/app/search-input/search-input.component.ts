import {Component, HostListener, OnInit} from '@angular/core';
import {TempStore} from "../store/temp-store";
import {PrimeNGConfig} from "primeng/api";
import {RegexSelection} from "../api/api-model";

const regexSelections = [
  {name: 'starts with', prefix: '^', suffix: ''},
  {name: 'contains', prefix: '.*', suffix: '.*'},
  {name: 'regex', prefix: '', suffix: ''},
];

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent implements OnInit {

  regexSelections: RegexSelection[] = regexSelections;
  regexSelection: RegexSelection = regexSelections[0];

  constructor(readonly tempStore: TempStore, private primengConfig: PrimeNGConfig) {
  }

  ngOnInit() {
    this.refresh()
    this.primengConfig.ripple = true;
    this.tempStore.vocabListSubject$.subscribe(vocabList => {
      if (vocabList.length) {
        this.total = vocabList[0]?.total ?? 0;
      }
    })
    this.tempStore.pageNumberSubject$.subscribe(pageNumber => {
      this.pageNumber = pageNumber;
    })
  }

  word: string = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  score: string = '0-9'
  pageNumber: number = 0
  size: number = 1
  total: number = 0

  refresh() {
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
      this.tempStore.pageNumberSubject$.next(Math.min(this.total - 1, this.pageNumber + 1))
    }
    if (event.key == 'ArrowLeft') {
      this.tempStore.pageNumberSubject$.next(Math.max(0, this.pageNumber - 1))
    }
  }

  refreshWordInput() {
    this.pageNumber = 0
    this.refresh();
  }
}
