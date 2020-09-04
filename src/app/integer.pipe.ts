import { Pipe, PipeTransform } from '@angular/core';
import BigNumber from 'bignumber.js';

@Pipe({
  name: 'integer'
})
export class IntegerPipe implements PipeTransform {

  transform(value: BigNumber): string {
    return value.toFixed(0);
  }

}
