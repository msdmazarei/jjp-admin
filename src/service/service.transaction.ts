import { BaseService, IAPI_ResponseList, IAPI_Response } from './service.base';
// import { appLocalStorage } from './appLocalStorage';

export class TransactionService extends BaseService {

    search(limit: number, skip: number, filter?: Object, sort?: string[]): Promise<IAPI_ResponseList<any>> {
        return this.axiosTokenInstance.post(`/transactions/_search`, { limit, skip , filter, sort });
    };

    remove(transaction_id: string) {
        return this.axiosTokenInstance.delete(`/transactions/${transaction_id}`);
    }

    byId(transaction_id: string): Promise<IAPI_Response<any>> {
        return this.axiosTokenInstance.get(`/transactions/${transaction_id}`);
    }

}