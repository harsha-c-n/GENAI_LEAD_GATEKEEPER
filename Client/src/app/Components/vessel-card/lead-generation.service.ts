import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface MaritimeLeadResponse {
  success: boolean;
  data: string;
}

@Injectable({
  providedIn: 'root'
})
export class MaritimeLeadService {
  constructor(private http: HttpClient) {}

  getMaritimeLeads(): Observable<MaritimeLeadResponse> {
    return this.http.get<MaritimeLeadResponse>('/api/maritime-leads');
  }
  getScrapedMaritimeLeads() { return this.http.get<string[]>('api/maritime-scraped-leads'); }
}