import {Injectable} from "@angular/core";
import {BehaviorSubject, Subject} from "rxjs";
import {SearchRequest, Vocab} from "../api/api-model";
import {ConfigService} from "../api/config.service";

@Injectable({providedIn: 'root'})
export class VocabStore {

  constructor(private configService: ConfigService) {
    this.pageNumberSubject$.subscribe(pageNumber => {
      this.params.page = pageNumber;
      this.refreshVocabs();
    })
  }

  vocabListSubject$ = new Subject<Vocab[]>();
  pageNumberSubject$ = new Subject<number>();
  playPhonetic$ = new BehaviorSubject<boolean>(false);
  params: SearchRequest = {}

  refreshVocabsByParams(params: SearchRequest): void {
    this.params = params;
    this.refreshVocabs();
  }

  private refreshVocabs() {
    this.configService.getVocabByRequest(this.params).subscribe(vocabList => {
      this.vocabListSubject$.next(vocabList);
    });
  }
}
