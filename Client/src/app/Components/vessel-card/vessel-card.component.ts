import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vessel-card',
  templateUrl: './vessel-card.component.html',
  styleUrls: ['./vessel-card.component.css']
})
export class VesselCardComponent implements OnInit {
  public companyData = [
    {
      name: "Bunge",
      employees: "23,000",
      industry: "Agriculture",
      links: {
        linkedIn: "https://www.linkedin.com",
        facebook: "https://www.facebook.com"
      }
    },
    {
      name: "Corteva Agriscience",
      employees: "21,000",
      industry: "Agriculture",
      links: {
        linkedIn: "https://www.linkedin.com",
        facebook: "https://www.facebook.com"
      }
    },
    {
      name: "Yara International",
      employees: "18,000",
      industry: "Agriculture",
      links: {
        linkedIn: "https://www.linkedin.com",
        facebook: "https://www.facebook.com"
      }
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Any initialization logic can go here if needed
  }
}
