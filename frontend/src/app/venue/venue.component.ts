import { Component, Input, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ChartOptions } from '../app.component';
import { Venue } from '../venue';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.scss']
})
export class VenueComponent implements OnInit {
  subscription = new Subscription();
  venue_id = 0;
  venue : Venue | any = {};
  pubs_x : string[]= [];
  pubs_y : string[]= [];
  public pubs_chartOptions: Partial<ChartOptions> | any;

  constructor(private activatedRoute: ActivatedRoute, private qs: QueryserviceService) { 
    this.pubs_chartOptions = {
      series: [
        {
          name: "Publications",
          data: ['1','2','3','4']
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      title: {
        text: "Yearwise publications"
      },
      xaxis: {
        categories: ['2016','2017','2018','2019']
      },
    };
   }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.venue_id = params['venue_id'];
      this.updateVenueInfo();
      this.updatePubsInfo();
    });
  }

  updateVenueInfo() : void {
    this.subscription.add(
      this.qs.getVenue(this.venue_id).subscribe(res => {
        this.venue = {
          id: res[0]['i']['id'],
          name: res[0]['i']['name'],
          acronym: res[0]['i']['acronym'],
          type: res[0]['i']['type'],
          n_pubs: res[0]['i']['n_pubs'],
          n_citations: res[0]['i']['n_citations'],
          flexibility: res[0]['i']['flexiblity']
        }
      })
    );
  }

  updatePubsInfo(): void {
    this.subscription.add(
      this.qs.getVenuePubs(this.venue_id).subscribe(res => {
        for(var ele of res){
          this.pubs_x.push(""+ele.year);
          this.pubs_y.push(""+ele.n_pubs);
        }  
        this.pubs_updateSeries(); 
      })
    );
  }

  public pubs_updateSeries() {
    this.pubs_chartOptions.series = [{
      data: this.pubs_y
    }];
    this.pubs_chartOptions.xaxis = {categories : this.pubs_x};
  }

}
