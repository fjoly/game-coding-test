import {Exception} from "../../exception/Exception";
import {Code} from "../../code/Code";
const moment=require('moment-timezone')


export class DateUtils {

  public static toDate(date: string): Date {
    const dateParts = date.split("/");
    if(dateParts=== null || dateParts.length !==3 ) {
      throw Exception.new({code: Code.BAD_REQUEST_ERROR, data: `The date must be in format dd/mm/yyyy`});
    }
    return moment(date, "DD/MM/YYYY").toDate();
  }

}
