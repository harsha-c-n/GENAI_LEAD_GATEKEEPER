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
  encapsulation: ViewEncapsulation.None,
})
export class VesselCardComponent implements OnInit {
  public rows: any[] = [];
  public columns = [
    { prop: 'company_name', name: 'Company Name', width: 200 },
    { prop: 'employees', name: 'Employees', width: 200 },
    { prop: 'profit', name: 'Revenue', width: 200 },
    { prop: 'market_cap', name: 'Market Cap', width: 200 },
    { prop: 'address', name: 'Location', width: 200 },
  ];
  maritimeLead = [];
  isLoading = true; // Tracks loading state

  constructor(private maritimeLeadService: MaritimeLeadService) {}

  ngOnInit() {
    this.getMaritimeLeads();
  }

  getMaritimeLeads() {
    this.isLoading = true; // Set loading to true before making the API call
    this.maritimeLeadService.getMaritimeLeads().subscribe(
      (data) => {
        console.log('API Response:', data); // Debug to check data structure
        const jsonMatch = data.data.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      try {
        this.maritimeLead = JSON.parse(jsonMatch[1]);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }
    console.log(this.maritimeLead,": maritimeLead")
    console.log(this.maritimeLead[0],": maritimeLead[0]")
        // this.maritimeLead = data.data;
        this.rows = this.maritimeLead; // Update the rows for the table
        this.isLoading = false; // API call is complete
      },
      (error) => {
        console.error('Error fetching maritime leads:', error);
        this.isLoading = false; // Handle error case
      }
    );
  }
}
