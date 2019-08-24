import { IAPI_Response,IAPI_ResponseList, BaseService } from "./service.base";
import { IPerson } from "../model/model.person";

export class PersonService extends BaseService {


    create(book: any) {
        return this.axiosTokenInstance.post('/books', book);
    }

    // search(limit: number, offset: number): Promise<IAPI_ResponseList<IPerson>> {
    //     return this.axiosTokenInstance.post(`/books/_search`, { limit, offset });
    // }

    remove(bookId: string) {
        return this.axiosTokenInstance.delete(`/books/${bookId}`);
    }

    byId(person_id: string): Promise<IAPI_Response<IPerson>> {
        return this.axiosTokenInstance.get(`/books/${person_id}`);
    }

    update(person: any, id: string) {
        return this.axiosTokenInstance.put(`/books/${id}`, person);
    }




    search(limit: number, offset: number, filter?: Object): Promise<IAPI_ResponseList<IPerson>> {
        return this.axiosTokenInstance.post(`/persons/_search`, { limit, offset, filter });
        // return this.instance.post(`http://book.mazarei.id.ir/persons/_search`, { limit, offset, filter});
    }

}