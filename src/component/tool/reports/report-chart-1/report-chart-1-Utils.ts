import { Localization } from "../../../../config/localization/localization";
import { BOOK_TYPES } from "../../../../enum/Book";

export abstract class R_1_CUtility {
    private static result: any[] = [];

    static report_creat_in_custom_type(report: any[]):{ name: string, value: number }[] {
        
        for (let i = 0; i < report.length; i++) {
            let obj: { name: string, value: number } =
            {
                name: report[i].title + "-" + Localization.book_type_list[report[i].type as BOOK_TYPES],
                value: report[i].count,
            }
            R_1_CUtility.result.push(obj);

        }

        let rtArray : { name: string, value: number }[] = R_1_CUtility.result;
        R_1_CUtility.result = [];
        return rtArray;
    }
}
