// import Axios from "axios";
import { IAPI_Response, IAPI_ResponseList, BaseService } from "./service.base";

export class PressAccountingService extends BaseService {

    search(limit: number, skip: number, filter?: Object , sort?: string[]): Promise<IAPI_ResponseList<any>> { 
        return this.axiosTokenInstance.post(`add_path`, { limit, skip, filter, sort });
    } 
    
    pressAccountingListFetchById(press_id: string): Promise<IAPI_Response<any>> {
        return this.axiosTokenInstance.get(`add_path${press_id}`);
    }

    removeFieldOfPressAccountList(field_id: string) {
        return this.axiosTokenInstance.delete(`add_path${field_id}`);
    }

    updateFieldOfPressAccountList(field: any, id: string) {
        return this.axiosTokenInstance.put(`add_path${id}`, field);
    }
}