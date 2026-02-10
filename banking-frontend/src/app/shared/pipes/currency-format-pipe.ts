import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
  standalone: true,
})
export class CurrencyFormatPipe implements PipeTransform {

  transform(value: number | null | undefined, currencySymbol: string = '$', decimals: number = 2): string {
    if (value === null || value === undefined || isNaN(value)) {
      return `${currencySymbol}0.00`;
    }

    // Format number with thousand separators and decimals
    const formatted = value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    return `${currencySymbol}${formatted}`;
  }

}
