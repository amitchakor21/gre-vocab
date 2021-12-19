import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs';
import {Vocab, SearchRequest} from "./api-model";

@Injectable()
export class ConfigService {

  constructor(private http: HttpClient) {
  }

  getVocabByRequest(request: SearchRequest):Observable<Vocab[]> {
    const url = `http://localhost:8080/search`;
    return this.http.post<Vocab[]>(url, request);
  }

  patchVocab(vocab: Vocab): Observable<Vocab> {
    const url = `http://localhost:8080/id/${vocab.id}`;
    return this.http.patch<Vocab>(url, vocab);
  }

}
