import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Word, WordType } from '../models/word.model';

@Injectable({ providedIn: 'root' })
export class WordService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getWordTypes(): Observable<WordType[]> {
    return this.http.get<WordType[]>(`${this.baseUrl}/word-types`);
  }

  getWords(typeId?: number): Observable<Word[]> {
    const url = typeId
      ? `${this.baseUrl}/words?typeId=${typeId}`
      : `${this.baseUrl}/words`;
    return this.http.get<Word[]>(url);
  }
}
