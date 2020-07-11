import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'comments'
})
export class CommentsPipe implements PipeTransform {

  transform(value: string): [string[]] {

    if(value){

    var res : string[] = value.split(/\r\n|\r|\n/);
    
    var tmp : string[] = [];
    var haha : [string[]] = [[]];
    res.forEach(element => {
          tmp = element.split(':');
          haha.push(tmp)
    });
    
    return haha;
  }else
  return [[]];
  }


}
