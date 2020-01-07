// import Axios from "axios";
import { IAPI_Response, IAPI_ResponseList, BaseService } from "./service.base";

export class PressAccountingService extends BaseService {

    search(limit: number, skip: number, filter?: Object , sort?: string[]): Promise<IAPI_ResponseList<any>> { 
        return this.axiosTokenInstance.post(``, { limit, skip, filter, sort });
    } 

    remove(bookId: string) {
        return this.axiosTokenInstance.delete(`${bookId}`);
    }

    byId(book_id: string): Promise<IAPI_Response<any>> {
        return this.axiosTokenInstance.get(`${book_id}`);
    }

    update(book: any, id: string) {
        return this.axiosTokenInstance.put(`${id}`, book);
    }
}