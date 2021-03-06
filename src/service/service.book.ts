// import Axios from "axios";
import { IBook } from "../model/model.book";
import { IAPI_Response, IAPI_ResponseList, BaseService } from "./service.base";

export class BookService extends BaseService {
    // instance = Axios.create({
    //     baseURL: '/api',
    //     headers: { 'authorization': 'Bearer 0be2e4cb-88b3-44a6-aeff-4eeb96e411c6' }
    // });

    addBook(book: any) {
        return this.axiosTokenInstance.post('/books', book);
    }

    search(limit: number, offset: number): Promise<IAPI_ResponseList<IBook>> {
        return this.axiosTokenInstance.post(`/books/_search`, { limit, offset });
    }


    bookById(bookId: string) {
        return this.axiosTokenInstance.post(`/books/_search`, { filter: { id: { bookId } } });
    }

    // bookEditById(editedbook: {}) {
    //     return this.instance.put("url", editedbook)
    // }

    removeBook(bookId: string) {
        return this.axiosTokenInstance.delete(`/books/${bookId}`);
    }

    byId(book_id: string): Promise<IAPI_Response<IBook>> {
        return this.axiosTokenInstance.get(`/books/${book_id}`);
    }

    update(book: any, id: string) {
        return this.axiosTokenInstance.put(`/books/${id}`, book);
    }

}