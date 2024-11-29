import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  // Vessel data
  exampleData = [
    { name: "Vessel A", type: "Cargo", company: "Company X" },
    { name: "Vessel B", type: "Tanker", company: "Company Y" },
    { name: "Vessel C", type: "Passenger", company: "Company Z" }
  ];

  // Chatbot messages
  chatMessages: string[] = [];

  // Method to generate prospective clients (vessel cards)
  generateProspectiveClients() {
    this.exampleData = [
      { name: "Vessel A", type: "Cargo", company: "Company X" },
      { name: "Vessel B", type: "Tanker", company: "Company Y" },
      { name: "Vessel C", type: "Passenger", company: "Company Z" }
    ];
  }

}
