import { IAPI_Response, BaseService } from "./service.base";
import { IPrice } from "../model/model.price";

export class PriceService extends BaseService {

    price(book_id: string, price: number) : Promise<IAPI_Response<IPrice>> {
        return this.axiosTokenInstance.post('/prices', {
            book_id: book_id,
            price: price
        });
    }

}