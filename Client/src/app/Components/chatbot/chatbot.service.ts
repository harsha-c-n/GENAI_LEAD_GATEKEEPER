import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable({
    providedIn: 'root'
  })
  export class ChatService {
    private apiUrl = '/api/chat'; 
  
    constructor(private http: HttpClient) {}
  
    sendMessage(messages: ChatMessage[]): Observable<ChatMessage> {
      return this.http.post<ChatMessage>(this.apiUrl, { messages })
        .pipe(
          catchError((error: HttpErrorResponse) => {
            console.error('Detailed error:', error);
            return throwError(() => new Error(`Error at ${error.url}: ${error.status} ${error.statusText}`));
          })
        );
    }
  

//   private handleError(error: HttpErrorResponse) {
//     console.error('An error occurred:', error);
//     return throwError(() => new Error('Something went wrong; please try again later.'));
//   }
}