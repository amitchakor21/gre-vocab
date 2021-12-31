import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs';
import {GoogleApiResponse} from "./api-model";

@Injectable({providedIn: 'root'})
export class GoogleDictionaryService {

  constructor(private http: HttpClient) {
  }

  getGoogleDictionaryMeaningByWord(word: string): Observable<GoogleApiResponse[]> {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    return this.http.get<GoogleApiResponse[]>(url);
  }

  executePhonetic(url: string): Observable<any> {
    console.log(url);
    return this.http.get<any>(`https://${url}`);
  }
}
