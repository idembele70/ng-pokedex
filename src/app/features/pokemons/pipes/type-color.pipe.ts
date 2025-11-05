import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeColor',
  standalone: true,
  pure: true,
})
export class TypeColorPipe implements PipeTransform {

  transform(type: string): string {
    const prefix = '#'
    switch (type) {
      case "Electric": return `${prefix}FFE175`;
      case "Grass": return `${prefix}B4FE7B`;
      case "Poisson": return `${prefix}BF8CD1`;
      case "Bug": return `${prefix}D1E16F`;
      case "Ghost": return `${prefix}805594`;
      case "Rock": return `${prefix}898373`;
      case "Ground": return `${prefix}CA9F5E`;
      case "water": return `${prefix}FFE175`;
      case "Fire": return `${prefix}FF8A8A`;
      case "Ice": return `${prefix}C6EAFF`;
      case "Fighting": return `${prefix}FFB169`;
      case "Steel": return `${prefix}E4E4E4`;
      case "Psychic": return `${prefix}FFB7FC`;
      case "Flying": return `${prefix}5F9FFF`;
      case "Dragon": return `${prefix}C699FF`;
      case "Normal": return `${prefix}88D1FB`;
      default: return `${prefix}CACACA`;
    }
  }

}
