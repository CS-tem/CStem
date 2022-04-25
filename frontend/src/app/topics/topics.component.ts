import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {
  subscription = new Subscription();
  topics: any = [{}];

  constructor(private qs : QueryserviceService) { }

  ngOnInit(): void {
    this.updateTopicsInfo();
  }

  updateTopicsInfo() : void {
    this.subscription.add(
      this.qs.getTopics().subscribe(res => {
        this.topics = res;
        console.log(res);
      })
    );
  }


}
