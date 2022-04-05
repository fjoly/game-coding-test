import {Exception} from "../../exception/exception";
import {Code} from "../../code/code";
const moment=require('moment-timezone')


export class DateUtils {

  public static toDate(date: string): Date {
    const dateParts = date.split("/");
    if(dateParts=== null || dateParts.length !==3 ) {
      throw Exception.new({code: Code.BAD_REQUEST_ERROR, data: `The date must be in format dd/mm/yyyy`});
    }
    return moment(date, "DD/MM/YYYY").toDate();
  }

  public static toStringDateFormat(date:Date): string {
    //Format date
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return  dd + '/' + mm + '/' + yyyy;
  }

}
