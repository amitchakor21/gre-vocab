import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs';
import {Vocab, SearchRequest} from "./api-model";

const GRE_SERVICE_BASE_URL = `http://localhost:8081`;

@Injectable({providedIn: 'root'})
export class ConfigService {

  constructor(private http: HttpClient) {
  }

  getVocabByRequest(request: SearchRequest):Observable<Vocab[]> {
    const url = `${GRE_SERVICE_BASE_URL}/search`;
    return this.http.post<Vocab[]>(url, request);
  }

  patchVocab(vocab: Vocab): Observable<Vocab> {
    const url = `${GRE_SERVICE_BASE_URL}/id/${vocab.id}`;
    return this.http.patch<Vocab>(url, vocab);
  }

}
