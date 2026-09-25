import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Sentence, SentencePayload } from '../models/sentence.model';

@Injectable({ providedIn: 'root' })
export class SentenceService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSentences(): Observable<Sentence[]> {
    return this.http.get<Sentence[]>(`${this.baseUrl}/sentences`);
  }

  getSentence(id: number): Observable<Sentence> {
    return this.http.get<Sentence>(`${this.baseUrl}/sentences/${id}`);
  }

  createSentence(payload: SentencePayload): Observable<Sentence> {
    return this.http.post<Sentence>(`${this.baseUrl}/sentences`, payload);
  }

  updateSentence(id: number, payload: SentencePayload): Observable<Sentence> {
    return this.http.put<Sentence>(`${this.baseUrl}/sentences/${id}`, payload);
  }
}
