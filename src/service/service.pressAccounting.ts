// import Axios from "axios";
import { IAPI_Response, IAPI_ResponseList, BaseService } from "./service.base";

export class PressAccountingService extends BaseService {

    search(limit: number, skip: number, filter?: Object , sort?: string[]): Promise<IAPI_ResponseList<any>> { 
        return this.axiosTokenInstance.post(`/payment-press-checkout/_search`, { limit, skip, filter, sort });
    } 

    addPaymentToEachPressAccount(payment_data : { payer_id : string , receiver_id : string , amount : number}): Promise<IAPI_ResponseList<any>> { 
        return this.axiosTokenInstance.post(`/payment-press-checkout`, payment_data);
    }
    
    pressAccountingListFetchById(press_id: string): Promise<IAPI_Response<any>> {
        return this.axiosTokenInstance.get(`/payment-press-checkout/total-paid/${press_id}`);
    }

    removeFieldOfPressAccountList(field_id: string) {
        return this.axiosTokenInstance.delete(`add_path${field_id}`);
    }

    updateFieldOfPressAccountList(field: any, id: string) {
        return this.axiosTokenInstance.put(`add_path${id}`, field);
    }
}