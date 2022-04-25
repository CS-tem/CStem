import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-institute',
  templateUrl: './institute.component.html',
  styleUrls: ['./institute.component.scss']
})
export class InstituteComponent implements OnInit {
  subscription = new Subscription();
  institutes: any = [{}];
  institute : any = {};

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

  updateInstituteInfo(id : number) : void {
    this.subscription.add(
      this.qs.getInstitute(id).subscribe(res => {
        this.institute = res;
        console.log(res);
      })
    );
  }

}
