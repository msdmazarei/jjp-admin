import { IAPI_ResponseList, BaseService } from "./service.base";
import { IPerson } from "../model/model.person";

export class PersonService extends BaseService {
    // instance = Axios.create({
    //     baseURL: '/api',
    //     headers: { 'authorization': 'Bearer 0be2e4cb-88b3-44a6-aeff-4eeb96e411c6' }
    // });


    search(limit: number, offset: number, filter?: Object): Promise<IAPI_ResponseList<IPerson>> {
        return this.axiosTokenInstance.post(`/persons/_search`, { limit, offset, filter });
        // return this.instance.post(`http://book.mazarei.id.ir/persons/_search`, { limit, offset, filter});
    }

}