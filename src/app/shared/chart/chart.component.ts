import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { ChartSlice } from './chart.model';
import { ChartPipe } from './chart.pipe';

@Component({
  selector: 'app-chart',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ChartPipe, TranslocoModule],
  template: `
    <ng-container *transloco="let t">
      <svg [attr.viewBox]="viewBoxAttr" *ngIf="data">
        <path
          *ngFor="
            let slice of data | chartPipe : radius : viewBox : borderSize;
            trackBy: trackByFn
          "
          [attr.fill]="slice.color"
          [attr.d]="slice.commands"
          [attr.transform]="'rotate(' + slice.offset + ')'"
          (click)="slice.onClickCb ? slice.onClickCb() : null"
        >
          <title>{{ t(slice.label || '') }}</title>
        </path>
      </svg>
      <div class="label">
        <p>{{ t(data.at(0)?.label || '') }}</p>
        <h1>{{ data.at(0)?.percent?.toFixed(2) }}%</h1>
        <p>{{ data.at(0)?.current }} / {{ data.at(0)?.amount }}</p>
      </div>
    </ng-container>
  `,
})
export class ChartComponent implements OnInit {
  @Input() radius = 80;
  @Input() viewBox = 170;
  @Input() borderSize = 15;
  @Input() data: ChartSlice[] = [];

  viewBoxAttr!: string;

  ngOnInit() {
    const sum = this.data?.reduce((accu, slice) => accu + slice.percent, 0);
    if (sum !== 100) {
      throw new Error(
        `The sum of all slices of the donut chart must equal to 100%. Found: ${sum}.`,
      );
    }

    this.viewBoxAttr = `0 0 ${this.viewBox} ${this.viewBox}`;
  }

  trackByFn(_index: number, slice: ChartSlice) {
    return slice.id;
  }
}
