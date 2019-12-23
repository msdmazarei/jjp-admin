// import Axios from "axios";
import { IBook } from "../model/model.book";
import { IAPI_Response, IAPI_ResponseList, BaseService } from "./service.base";
import { AccessService } from "./service.access";
import { Store2 } from "../redux/store";

export class BookService extends BaseService {
    // instance = Axios.create({
    //     baseURL: '/api',
    //     headers: { 'authorization': 'Bearer 0be2e4cb-88b3-44a6-aeff-4eeb96e411c6' }
    // });

    create(book: any) {
        return this.axiosTokenInstance.post('/books', book);
    }

    search(limit: number, skip: number, filter?: Object , sort?: string[]): Promise<IAPI_ResponseList<IBook>> { 
        return this.axiosTokenInstance.post(`/books/filter-book`, { limit, skip, filter, sort });
    } 

    searchWithPress(limit: number, skip: number, inputValue: any): Promise<IAPI_ResponseList<IBook>> { 
        let filter = undefined;
        if (inputValue) {
            if (AccessService.checkAccess('BOOK_ADD_PREMIUM') === true) {
                filter = { title: { $prefix: inputValue } };
            }
            if (AccessService.checkAccess('BOOK_ADD_PREMIUM') === false) {
                let persons_of_press: string[];
                persons_of_press = [];
                const wrapper = Store2.getState().logged_in_user!.permission_groups || [];
                persons_of_press = [...wrapper];
                filter = { title: { $prefix: inputValue }, press: { $in: persons_of_press } };
            }
        } else {
            if (AccessService.checkAccess('BOOK_ADD_PREMIUM') === true) {
                filter = undefined;
            }
            if (AccessService.checkAccess('BOOK_ADD_PREMIUM') === false) {
                let persons_of_press: string[];
                persons_of_press = [];
                const wrapper = Store2.getState().logged_in_user!.permission_groups || [];
                persons_of_press = [...wrapper];
                filter = { press: { $in: persons_of_press } };
            }
        };
        return this.axiosTokenInstance.post(`/books/filter-book`, { limit, skip,filter });
    }

    remove(bookId: string) {
        return this.axiosTokenInstance.delete(`/books/${bookId}`);
    }

    byId(book_id: string): Promise<IAPI_Response<IBook>> {
        return this.axiosTokenInstance.get(`/books/${book_id}`);
    }

    update(book: any, id: string) {
        return this.axiosTokenInstance.put(`/books/${id}`, book);
    }

}