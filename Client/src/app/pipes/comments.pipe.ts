import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'comments'
})
export class CommentsPipe implements PipeTransform {

  transform(value: string): [string[]] {

    console.log("val", value);

    let res : string[] = value.split(/\r\n|\r|\n/);
    

    res.forEach((res) => {
      console.log("res", res);
    });
    
    var tmp : string[] = [];
    var haha : [string[]] = [[]];
    res.forEach(element => {
          tmp = element.split(':');
          haha.push(tmp)
          console.log("tmp", tmp);
    });
    
    return haha;
  }

}
