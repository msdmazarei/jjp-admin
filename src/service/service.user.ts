import { IAPI_Response,IAPI_ResponseList, BaseService } from "./service.base";
import { IUser } from "../model/model.user";

export class UserService extends BaseService {

    
    create(user: any) {
        return this.axiosTokenInstance.post('/users',user);
    }
    
    search(limit: number, offset: number, filter?: Object): Promise<IAPI_ResponseList<IUser>> {
        return this.axiosTokenInstance.post(`/users/_search`, { limit, offset, filter });
        // return this.instance.post(`http://book.mazarei.id.ir/persons/_search`, { limit, offset, filter});
    }
    // search(limit: number, offset: number): Promise<IAPI_ResponseList<IUser>> {
    //     return this.axiosTokenInstance.post(`/books/_search`, { limit, offset });
    // }

    remove(userId: string) {
        return this.axiosTokenInstance.delete(`/users/${userId}`);
    }

    byId(user_id: string): Promise<IAPI_Response<IUser>> {
        return this.axiosTokenInstance.get(`/users/${user_id}`);
    }

    update(user: any, id: string) {
        return this.axiosTokenInstance.put(`/users/${id}`, user);
    }





}