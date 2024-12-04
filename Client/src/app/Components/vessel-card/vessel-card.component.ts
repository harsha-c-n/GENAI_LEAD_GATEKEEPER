import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MaritimeLeadService } from './lead-generation.service';
interface MaritimeLead {
  id: string;
  name: string;
  description: string;
  // Add other properties as needed
}

@Component({
  selector: 'app-vessel-card',
  templateUrl: './vessel-card.component.html',
  styleUrls: ['./vessel-card.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VesselCardComponent implements OnInit {
  public rows = [
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

  public columns = [
    { prop: 'name', name: 'Company Name' },
    { prop: 'industry', name: 'Industry' },
    { prop: 'employees', name: 'Employees' }
  ];

  maritimeLeads: MaritimeLead[] = [];
  constructor(private maritimeLeadService: MaritimeLeadService) {}

  ngOnInit() {
    this.getMaritimeLeads();
  }

  getMaritimeLeads() {
    this.maritimeLeadService.getMaritimeLeads().subscribe(
      (data) => {
        console.log('API Response:', data); // Debug to check data structure
        this.maritimeLeads = data as MaritimeLead[];
      },
      (error) => {
        console.error('Error fetching maritime leads:', error);
      }
    );
  }
  
}