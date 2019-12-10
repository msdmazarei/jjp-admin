import { BaseService, IAPI_ResponseList, IAPI_Response } from './service.base';
// import { appLocalStorage } from './appLocalStorage';

export class AccountService extends BaseService {

    byId(user_id: string): Promise<IAPI_Response<any>> {
        return this.axiosTokenInstance.get(`/accounts/${user_id}`);
    }

}