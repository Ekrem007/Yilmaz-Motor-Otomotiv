import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'turkishCurrency',
  standalone: true
})
export class TurkishCurrencyPipe implements PipeTransform {

  transform(value: number | string): string {
    if (value === null || value === undefined || value === '') {
      return '0,00 ₺';
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) {
      return '0,00 ₺';
    }

    // Sayıyı 2 ondalık basamağa yuvarla
    const rounded = Math.round(numValue * 100) / 100;
    
    // Sayıyı string'e çevir ve parçalara ayır
    const parts = rounded.toFixed(2).split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];
    
    // Binlik ayırıcıları ekle (nokta ile)
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    // Ondalık kısmı virgül ile birleştir ve ₺ sembolü ekle
    return `${formattedInteger},${decimalPart} ₺`;
  }
}
