import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-institutes',
  templateUrl: './institutes.component.html',
  styleUrls: ['./institutes.component.scss']
})
export class InstitutesComponent implements OnInit {
  subscription = new Subscription();
  institutes: any = [{}];

  constructor(private qs : QueryserviceService) { }

  ngOnInit(): void {
    this.updateInstitutesInfo();
  }

  updateInstitutesInfo() : void {
    this.subscription.add(
      this.qs.getInstitutes().subscribe(res => {
        this.institutes = res;
        console.log(res);
      })
    );
  }

}
