import { BaseService, IAPI_ResponseList } from './service.base';
// import { appLocalStorage } from './appLocalStorage';

export class AccountService extends BaseService {
    
    byId(limit: number, skip: number, id: string): Promise<IAPI_ResponseList<any>> {
        const filter : object ={type:"Main" , person_id : id}
        return this.axiosTokenInstance.post(`/accounts/_search`, { limit, skip, filter });
    }

}