import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-second-page',
  templateUrl: './second-page.component.html',
  styleUrl: './second-page.component.css'
})
export class SecondPageComponent {
  constructor(private router: Router) {} 



  // Chatbot messages
  chatMessages: string[] = [];

  // Method to generate prospective clients (vessel cards)
  generateProspectiveClients() {

  }
  toggleChatbotModal() {
    const modal = document.getElementById('chatbot-modal');
    
    if (modal) {
      modal.style.display = modal.style.display === 'block' ? 'none' : 'block'; // Toggle modal display
    }
  }
  goToHome() {
    this.router.navigate(['/']); // Navigate to the home page
  }


}
