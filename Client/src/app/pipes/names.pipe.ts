import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'names'
})
export class NamesPipe implements PipeTransform {

  transform(value: string): string {
    console.log(value.length);
    if(value == ''){
      return '';
    }else if(value.length > 15){
    
    return value.split(' ').map((word) => { return word[0];}).join(' . '); 
  }else
      return value;
  }

}
