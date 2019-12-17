// import Axios from "axios";
import { IAPI_ResponseList, BaseService } from "./service.base";

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
        let typeObj : object = {type : selectedType}
        return this.axiosTokenInstance.post(`/reports/book-by-type`, typeObj);
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