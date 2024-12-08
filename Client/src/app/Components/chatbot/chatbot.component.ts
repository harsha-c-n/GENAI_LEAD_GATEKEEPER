import { Component } from '@angular/core';
import { ChatService, ChatMessage } from './chatbot.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  messages: ChatMessage[] = [];
  userInput = '';
  loading = false;

  constructor(private chatService: ChatService) {}

  sendMessage() {
    if (!this.userInput.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: this.userInput
    };
    this.userInput = '';
    this.messages.push(userMessage);
    this.loading = true;
    this.chatService.sendMessage(this.messages)
      .subscribe({
        next: (response: ChatMessage) => {
          this.messages.push(response);
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Chat error', err);
          this.loading = false;
        }
      });
  }
}