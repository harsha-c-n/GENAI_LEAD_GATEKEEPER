import { Component } from '@angular/core';
import { ChatService, ChatMessage } from './chatbot.service';

@Component({
  selector: 'app-chatbot',
  template: `
    <div class="chat-container">
      <div class="messages">
        <div *ngFor="let msg of messages" 
             [ngClass]="msg.role">
          {{ msg.content }}
        </div>
      </div>
      <input 
        [(ngModel)]="userInput"
        (keyup.enter)="sendMessage()"
        placeholder="Type your message"
      >
      <button (click)="sendMessage()">Send</button>
    </div>
  `,
  styles: [`
    .chat-container { 
      width: 205px; 
      margin: 0 auto;
      border: 1px solid #ccc; 
    }
    .user { text-align: right; color: blue; }
    .assistant { text-align: left; color: green; }
  `]
})
export class ChatbotComponent {
  messages: ChatMessage[] = [];
  userInput = '';

  constructor(private chatService: ChatService) {}

  sendMessage() {
    if (!this.userInput.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: this.userInput
    };

    this.messages.push(userMessage);
    
    this.chatService.sendMessage(this.messages)
      .subscribe({
        next: (response: ChatMessage) => {
          this.messages.push(response);
          this.userInput = '';
        },
        error: (err: any) => {
          console.error('Chat error', err);
        }
      });
  }
}