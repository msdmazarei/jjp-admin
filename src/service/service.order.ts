import { BaseService, IAPI_Response, IAPI_ResponseList } from './service.base';
import { IBook } from '../model/model.book';

interface IOrderItem {
    book_id: string;
    count: number;
}

export type IOrderItems = IOrderItem[];

export class OrderService extends BaseService {

    search(limit: number, skip: number, filter?: Object, sort?: string[]): Promise<IAPI_ResponseList<any>> {
        return this.axiosTokenInstance.post(`/orders/_search`, { limit, skip, filter, sort });
    }

    remove(order_id: string) {
        return this.axiosTokenInstance.delete(`/orders/${order_id}`);
    }


    // for test ///
    byId(order_id: string): Promise<IAPI_Response<any>> {
        return this.axiosTokenInstance.get(`/order/${order_id}`);
    }

    getOrder_items(order_id: string): Promise<IAPI_ResponseList<{
        book: IBook;
        count: number;
        order: any; // todo: IOrder
        id: string;
        order_id:string;
    }>> {
        return this.axiosTokenInstance.get(`/order-items/order/${order_id}`);
    }

    update(newOrder: any, id: string) {
        return this.axiosTokenInstance.put(`/orders/${id}`, newOrder);
    }

    create(newOrder: any) {
        return this.axiosTokenInstance.post('/orders', newOrder);
    }
    ///////////////

    order(items: IOrderItems, person_id: string): Promise<IAPI_Response<any>> {
        return this.axiosTokenInstance.post('/orders', { items, person_id });
    }

    checkout(order_id: string, person_id: string): Promise<any> {
        return this.axiosTokenInstance.post(`/orders/checkout/${order_id}`, { person_id });
    }

}