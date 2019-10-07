import { BaseService, IAPI_Response } from "./service.base";

export class GroupService extends BaseService {

    search(limit: number, offset: number, filter?: Object){
        // return this.axiosTokenInstance.post(`/groups/_search`,{ limit, offset, filter });
        return this.axiosTokenInstance.post(`/groups/_search`,{limit,offset,filter});
    }


    create(group: object) {
        return this.axiosTokenInstance.post('/groups',group);
    }

    
    update(group:object , group_id: string) {
        return this.axiosTokenInstance.put(`/groups/${group_id}`,group);
    }


    remove(group_id: string) {
        return this.axiosTokenInstance.delete(`/groups/${group_id}`);
    }

    byId(group_id: string): Promise<IAPI_Response<any>> {
        return this.axiosTokenInstance.get(`/groups/${group_id}`);
    }

}