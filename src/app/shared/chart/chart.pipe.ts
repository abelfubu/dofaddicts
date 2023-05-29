import { Pipe, PipeTransform } from '@angular/core';
import { ChartSlice } from './chart.model';

interface DonutSliceWithCommands extends ChartSlice {
  offset: number;
  commands: string;
}

@Pipe({
  name: 'chartPipe',
  standalone: true,
})
export class ChartPipe implements PipeTransform {
  transform(
    donutSlices: ChartSlice[],
    radius: number,
    svgSize: number,
    borderSize: number
  ): DonutSliceWithCommands[] {
    let previousPercent = 0;
    return donutSlices.map((slice) => {
      const sliceWithCommands: DonutSliceWithCommands = {
        ...slice,
        commands: this.getSliceCommands(slice, radius, svgSize, borderSize),
        offset: previousPercent * 3.6 * -1,
      };
      previousPercent += slice.percent;
      return sliceWithCommands;
    });
  }

  getSliceCommands(
    donutSlice: ChartSlice,
    radius: number,
    svgSize: number,
    borderSize: number
  ): string {
    const degrees = this.percentToDegrees(donutSlice.percent);
    const longPathFlag = degrees > 180 ? 1 : 0;
    const innerRadius = radius - borderSize;

    const commands: string[] = [];
    commands.push(`M ${svgSize / 2 + radius} ${svgSize / 2}`);
    commands.push(
      `A ${radius} ${radius} 0 ${longPathFlag} 0 ${this.getCoordFromDegrees(
        degrees,
        radius,
        svgSize
      )}`
    );
    commands.push(
      `L ${this.getCoordFromDegrees(degrees, innerRadius, svgSize)}`
    );
    commands.push(
      `A ${innerRadius} ${innerRadius} 0 ${longPathFlag} 1 ${
        svgSize / 2 + innerRadius
      } ${svgSize / 2}`
    );
    return commands.join(' ');
  }

  getCoordFromDegrees(angle: number, radius: number, svgSize: number): string {
    const x = Math.cos((angle * Math.PI) / 180);
    const y = Math.sin((angle * Math.PI) / 180);
    const coordX = x * radius + svgSize / 2;
    const coordY = y * -radius + svgSize / 2;
    return [coordX, coordY].join(' ');
  }

  percentToDegrees(percent: number): number {
    return percent * 3.6;
  }
}
