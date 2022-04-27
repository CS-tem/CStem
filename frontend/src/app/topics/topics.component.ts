import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {
  displayedColumns = ["id", "name", "n_articles", "n_authors", "n_citations"];
  subscription = new Subscription();
  topics: any = [{}];

  constructor(private qs : QueryserviceService) { }

  ngOnInit(): void {
    this.updateTopicsInfo();
  }

  updateTopicsInfo() : void {
    this.subscription.add(
      this.qs.getTopics().subscribe(res => {
        for (var i = 0; i < res.length; i++) {
          res[i].name = this.capitalize(res[i].name);
        }
        this.topics = res;
        this.sortData({
          active: 'n_citations',
          direction: 'desc',
        });
      })
    );
  }

  sortData(sort: Sort) {
    const data = this.topics.slice();
    if (!sort.active || sort.direction === '') {
      this.topics = data;
      return;
    }

    this.topics = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return compare(a.id, b.id, isAsc);
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'n_articles':
          return compare(a.n_articles, b.n_articles, isAsc);
        case 'n_authors':
          return compare(a.n_authors, b.n_authors, isAsc);
        case 'n_citations':
          return compare(a.n_citations, b.n_citations, isAsc);
        default:
          return 0;
      }
    });
  }

  capitalize(input: string) {  
    var words = input.split(' ');  
    var CapitalizedWords: Array<string> = [];  
    words.forEach((element: string) => {  
        CapitalizedWords.push(element[0].toUpperCase() + element.slice(1, element.length));  
    });  
    return CapitalizedWords.join(' ');  
  } 

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
