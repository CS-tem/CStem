import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.scss']
})
export class VenueComponent implements OnInit {
  subscription = new Subscription();
  venues: any = [{}];
  constructor(private qs: QueryserviceService) { }

  ngOnInit(): void {
  }

  updateVenuesInfo() : void {
    this.subscription.add(
      this.qs.getVenues().subscribe(res => {
        this.venues = res;
        console.log(res);
      })
    );
  }

}
