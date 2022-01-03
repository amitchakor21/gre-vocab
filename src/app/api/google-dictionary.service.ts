import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs';
import {GoogleApiResponse} from "./api-model";

@Injectable({providedIn: 'root'})
export class GoogleDictionaryService {

  audio = new Audio();

  constructor(private http: HttpClient) {
  }

  getGoogleDictionaryMeaningByWord(word: string): Observable<GoogleApiResponse[]> {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    return this.http.get<GoogleApiResponse[]>(url);
  }

  playPhonetic(url: string) {
    this.audio.pause()
    this.audio.src = `https:${url}`;
    this.audio.load();
    this.audio.play();
  }
}
