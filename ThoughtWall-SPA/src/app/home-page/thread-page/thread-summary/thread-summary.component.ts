import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-thread-summary',
  template: `
    <div class="container">
      <mat-card *ngFor="let thread of threads"
      [routerLink]="['/thread', thread.id]">
        <mat-card-header>
          <div mat-card-avatar class="centre">{{ thread.username.slice(0,1) | uppercase}}</div>
          <mat-card-title>{{ thread.title }}</mat-card-title>
          <mat-card-subtitle><span style="color:#4DD0E1">{{ thread.username | titlecase }}</span> |
          {{ thread.comments.length }} comment{{ thread.comments.length == 1 ? '' : 's' }}
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>{{ thread.body | slice:0:200 }}
          {{ thread.body.length <= 200 ? '' : '...' }}
          </p>
        </mat-card-content><br />
        <div class="cardFooter">{{ thread.timeStamp | timeAgo  }}</div>
      </mat-card>
    <div>
  `,
  styles: [`
    h2 {
      margin: 0px 0 0 0;
    }
    #timestamp {
        color: rgb(128, 163, 173);
        font-size: 12px;
    }
    .centre {
        text-align: center;
        font-size: 28px;
        font-weight: bold;
    }
    .mat-card {
        display: inline-block;
        margin: 20px;
        width: 350px;
        min-height: 180px;
        vertical-align:top;
    }
    .mat-card:hover {
        cursor: pointer;
        -webkit-box-shadow: 6px 6px 12px rgb(119, 210, 235);
        box-shadow: 6px 6px 12px rgb(119, 210, 235);
    }
    .container {
        text-align: center;
    }
    .cardFooter {
        position: absolute;
        bottom: 4px;
        right: 7px;
    }
  `],
})

export class ThreadSummaryComponent {
  @Input() threads: [];

  constructor() {
  }
}
