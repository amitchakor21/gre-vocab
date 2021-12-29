import {Injectable} from "@angular/core";
import {SearchRequest, Vocab} from "../api/api-model";
import {ComponentStore} from "@ngrx/component-store";
import {BehaviorSubject, Observable} from "rxjs";
import {ConfigService} from "../api/config.service";

export interface VocabsState {
  vocabList: Vocab[];
  word: string;
  score: string;
  page: number;
  size: number;
}

@Injectable({providedIn: 'root'})
export class VocabStore extends ComponentStore<VocabsState> {

  // vocabListSubject$ : Observable<Vocab[]> =;
  readonly vocabListSubject$: Observable<Vocab[]> = this.select(state => state.vocabList);


  constructor(private configService: ConfigService) {
    super({
      vocabList: [],
      word: '',
      score: '0-10',
      page: 0,
      size: 20
    });
  }

  readonly setVocabList = this.updater(
    (state: VocabsState, vocabs: Vocab[]) => {
      return {...state, vocabs};
    }
  );

  readonly setWord = this.updater(
    (state: VocabsState, word: string) => {
      return {...state, word};
    }
  );

  readonly setScore = this.updater(
    (state: VocabsState, score: string) => {
      return {...state, score};
    }
  );

  readonly setPage = this.updater(
    (state: VocabsState, page: number) => {
      return {...state, page};
    }
  );

  readonly setSize = this.updater(
    (state: VocabsState, size: number) => {
      return {...state, size};
    }
  );


  refreshVocabs(): void {
    const state: VocabsState = this.get();
    const params: SearchRequest = {};
    if (state.word) {
      params.word = state.word;
    }
    if (state.score) {
      params.score = state.score;
    }
    if (state.page) {
      params.page = state.page;
    }
    if (state.size) {
      params.size = state.size;
    }

    this.configService.getVocabByRequest(params).subscribe(vocabList => {
      console.log(vocabList);
      this.setVocabList(vocabList);
    });

  }
}
