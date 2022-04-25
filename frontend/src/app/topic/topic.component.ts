import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {

  subscription = new Subscription();
  topics: any = [{}];

  constructor(private qs : QueryserviceService) { }

  ngOnInit(): void {
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
