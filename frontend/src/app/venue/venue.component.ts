import { Component, Input, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.scss']
})
export class VenueComponent implements OnInit {
  subscription = new Subscription();
  venue_id = 0;
  venue = {};
  constructor(private activatedRoute: ActivatedRoute, private qs: QueryserviceService) {  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.venue_id = params['venue_id'];
      this.updateVenueInfo();
    });
  }

  updateVenueInfo() : void {
    this.subscription.add(
      this.qs.getVenue(this.venue_id).subscribe(res => {
        this.venue = res;
        console.log(res);
      })
    );
  }

}
