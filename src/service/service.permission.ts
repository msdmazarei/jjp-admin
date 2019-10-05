import { BaseService, IAPI_Response } from "./service.base";

export class PermissionService extends BaseService {

    search(limit: number, offset: number, filter?: Object){
        // return this.axiosTokenInstance.post(`/permissions/_search`,{ limit, offset, filter });
        return this.axiosTokenInstance.post(`/permissions/_search`,{limit,offset,filter});
    }


    create(permission: object) {
        return this.axiosTokenInstance.post('/permissions',permission);
    }

    
    update(permission:object , permissionId: string) {
        return this.axiosTokenInstance.put(`/permissions/${permissionId}`,permission);
    }


    remove(permissionId: string) {
        return this.axiosTokenInstance.delete(`/permissions/${permissionId}`);
    }

    byId(permissions_id: string): Promise<IAPI_Response<any>> {
        return this.axiosTokenInstance.get(`/permissions/${permissions_id}`);
    }

}