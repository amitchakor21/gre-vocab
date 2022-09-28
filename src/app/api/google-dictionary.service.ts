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

  playPhoneticByWord(word: string) {
    this.audio.pause();
    this.audio.src = `https://api.dictionaryapi.dev/media/pronunciations/en/${word}-us.mp3`;
    this.audio.load();
    this.audio.play().catch(error => console.warn(error));
  }
}
