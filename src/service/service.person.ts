import { IAPI_Response,IAPI_ResponseList, BaseService } from "./service.base";
import { IPerson } from "../model/model.person";
import { AccessService } from "./service.access";
import { Store2 } from "../redux/store";

export class PersonService extends BaseService {

    
    create(person: any):Promise<IAPI_Response<IPerson>> {
        return this.axiosTokenInstance.post('/persons',person);
    }
    
    search(limit: number, skip: number, filter?: Object, sort?: string[]): Promise<IAPI_ResponseList<IPerson>> {
        return this.axiosTokenInstance.post(`/persons/_search`, { limit, skip, filter, sort });
    }

    searchPress(limit: number, skip: number, inputValue?: any): Promise<IAPI_ResponseList<IPerson>> {
        let filter: any = { is_legal: { $eq: true } };
        if (inputValue) {
            filter['full_name'] = { $prefix: inputValue };
        }
        if(AccessService.checkAccess('PERSON_GET_PREMIUM') === false){
            let persons_of_press: string[];
            persons_of_press = [];
            const wrapper = Store2.getState().logged_in_user!.permission_groups || [];
            persons_of_press = [...wrapper];
            filter['id'] = { $in: persons_of_press };
        }
        return this.axiosTokenInstance.post(`/persons/_search`, { limit, skip, filter});
    }

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