// import Axios from "axios";
import { IAPI_ResponseList, BaseService } from "./service.base";
import { AccessService } from "./service.access";
import { TPERMISSIONS } from "../enum/Permission";
import { Store2 } from "../redux/store";

export class ReportService extends BaseService {

    best_seller_book_month(): Promise<IAPI_ResponseList<any>>{
        return this.axiosTokenInstance.get(`/reports/book-of-month-bestseller`);
    };

    best_seller_book_week(): Promise<IAPI_ResponseList<any>>{
        return this.axiosTokenInstance.get(`/reports/book-of-week-bestseller`);
    };

    low_seller_book_month(): Promise<IAPI_ResponseList<any>>{
        return this.axiosTokenInstance.get(`/reports/book-of-month-lowseller`);
    };

    low_seller_book_week(): Promise<IAPI_ResponseList<any>>{
        return this.axiosTokenInstance.get(`/reports/book-of-week-lowseller`);
    };
    
    last_sell_by_book_type(selectedType : string): Promise<IAPI_ResponseList<any>>{ 
        let obj : any = {} ;
        obj['type'] = selectedType;
        // let typeObj : object = {type : selectedType}
        if(AccessService.checkAccess(TPERMISSIONS.REPORT_GET_PREMIUM) === false){
            let persons_of_press: string[];
            persons_of_press = [];
            const wrapper = Store2.getState().logged_in_user!.permission_groups || [];
            persons_of_press = [...wrapper];
            obj['press'] = { $in: persons_of_press }
        }
        return this.axiosTokenInstance.post(`/reports/book-by-type`, obj);
    };

    income_by_time_period(){
        return this.axiosTokenInstance.get(`/reports/total-income-by-month`);
    }

    press_sale_compare(press_id_array?: object){
        return this.axiosTokenInstance.post(`/reports/annual-book-sale-by-press`, press_id_array);
    }

    user_to_customer(){
        return this.axiosTokenInstance.get(`/reports/user-performance`);
    }
}