import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-venues',
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.scss']
})
export class VenuesComponent implements OnInit {
  subscription = new Subscription();
  venues: any = [{}];

  constructor(private qs: QueryserviceService) { }

  ngOnInit(): void {
    this.updateVenuesInfo();
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
