import { BaseService,IAPI_Response , IAPI_ResponseList } from './service.base';

interface IOrderItem {
    book_id: string;
    count: number;
}

export type IOrderItems = IOrderItem[];

export class OrderService extends BaseService {

    search(limit: number, offset: number, filter?: Object): Promise<IAPI_ResponseList<any>> {
        return this.axiosTokenInstance.post(`/orders/_search`, { limit, offset, filter });
    }

    remove(bookId: string) {
        return this.axiosTokenInstance.delete(`/orders/${bookId}`);
    }


    // for test ///
    byId(book_id: string): Promise<IAPI_Response<any>> {
        return this.axiosTokenInstance.get(`/books/${book_id}`);
    }

    update(book: any, id: string) {
        return this.axiosTokenInstance.put(`/books/${id}`, book);
    }

    create(book: any) {
        return this.axiosTokenInstance.post('/books', book);
    }
    ///////////////

    order(items: IOrderItems, person_id: string): Promise<IAPI_Response<any>> {
        return this.axiosTokenInstance.post('/orders', { items, person_id });
    }

    checkout(order_id: string, person_id: string): Promise<any> {
        return this.axiosTokenInstance.post(`/orders/checkout/${order_id}`, { person_id });
    }

}
