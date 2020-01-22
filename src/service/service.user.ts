import { IAPI_Response,IAPI_ResponseList, BaseService } from "./service.base";
import { IUser } from "../model/model.user";

export class UserService extends BaseService {

    
    create(user: any) {
        return this.axiosTokenInstance.post('/users',user);
    }
    
    search(limit: number, skip: number, filter?: Object, sort?: string[]): Promise<IAPI_ResponseList<IUser>> {
        return this.axiosTokenInstance.post(`/users/_search`, { limit, skip, filter, sort });
        // return this.instance.post(`http://book.mazarei.id.ir/persons/_search`, { limit, skip, filter});
    }
    // search(limit: number, skip: number): Promise<IAPI_ResponseList<IUser>> {
    //     return this.axiosTokenInstance.post(`/books/_search`, { limit, skip });
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

    changePassword(old_password: string, new_password: string, user_id: string): Promise<any> {
        return this.axiosTokenInstance.put(`/users/${user_id}`, { old_password, password: new_password });
    }

}