import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {
  subscription = new Subscription();
  topic_id = 0;
  topic = {};

  constructor(private activatedRoute: ActivatedRoute, private qs : QueryserviceService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.topic_id = params['topic_id'];
      this.updateTopicInfo();
    });
  }

  updateTopicInfo() : void {
    this.subscription.add(
      this.qs.getTopic(this.topic_id).subscribe(res => {
        this.topic = res;
        console.log(res);
      })
    );
  }

}
