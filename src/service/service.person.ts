import { IAPI_Response,IAPI_ResponseList, BaseService } from "./service.base";
import { IPerson } from "../model/model.person";

export class PersonService extends BaseService {

    
    create(person: any):Promise<IAPI_Response<IPerson>> {
        return this.axiosTokenInstance.post('/persons',person);
    }
    
    search(limit: number, skip: number, filter?: Object, sort?: string[]): Promise<IAPI_ResponseList<IPerson>> {
        return this.axiosTokenInstance.post(`/persons/_search`, { limit, skip, filter, sort });
        // return this.instance.post(`http://book.mazarei.id.ir/persons/_search`, { limit, skip, filter});
    }
    // search(limit: number, skip: number): Promise<IAPI_ResponseList<IPerson>> {
    //     return this.axiosTokenInstance.post(`/books/_search`, { limit, skip });
    // }

    remove(personId: string) {
        return this.axiosTokenInstance.delete(`/persons/${personId}`);
    }

    byId(person_id: string): Promise<IAPI_Response<IPerson>> {
        return this.axiosTokenInstance.get(`/persons/${person_id}`);
    }

    update(person: any, id: string) {
        return this.axiosTokenInstance.put(`/persons/${id}`, person);
    }





}