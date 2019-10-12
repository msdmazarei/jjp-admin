import { BaseService, IAPI_Response, IAPI_ResponseList } from "./service.base";

export class GroupService extends BaseService {

    search(limit: number, offset: number, filter?: Object): Promise<IAPI_ResponseList<any>>{
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

    addUserToGroup(group: object) {
        return this.axiosTokenInstance.post(`/group-users`,group);
    }

    removeUserFromGroup(group: object) {
        return this.axiosTokenInstance.post(`/group-users/remove-users`,group);
    }
    

    fetchUserGroups(user_id: string): Promise<IAPI_ResponseList<any>> {
        return this.axiosTokenInstance.get(`/group-users/user/${user_id}`);
    }

    addPermissionToGroup(permission: object) {
        return this.axiosTokenInstance.post(`/group-permissions`,permission);
    }

    removePermissionFromGroup(permission: object) {
        return this.axiosTokenInstance.post(`/group-permissions/remove`,permission);
    }

    fetchGroupPermissions(groupData: object): Promise<IAPI_ResponseList<any>> {
        return this.axiosTokenInstance.post(`/group-permissions/group`,groupData);
    }

}