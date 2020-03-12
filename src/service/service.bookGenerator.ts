  
// import Axios from "axios";
import { IAPI_Response, IAPI_ResponseList, BaseService } from "./service.base";

export class BookGeneratorService extends BaseService {
    // instance = Axios.create({
    //     baseURL: '/api',
    //     headers: { 'authorization': 'Bearer 0be2e4cb-88b3-44a6-aeff-4eeb96e411c6' }
    // });


    search(limit: number, skip: number, filter?: Object, sort?: string[]): Promise<IAPI_ResponseList<any>> {
        return this.axiosTokenInstance.post(`/book-contents/_search`, { limit, skip, filter, sort });
    }

    create( book_id : string, type : string, content : object ) {
        return this.axiosTokenInstance.post('/book-contents', { book_id , type , content });
    }

    byId(contentId: string): Promise<IAPI_Response<any>> {
        return this.axiosTokenInstance.get(`/book-contents/${contentId}`);
    }

    update(contentId: string , book_id : string, type : string, content : object ) {
        return this.axiosTokenInstance.put(`/book-contents/${contentId}`, { book_id , type , content } );
    }

    remove(contentId: string) {
        return this.axiosTokenInstance.delete(`/book-contents/${contentId}`);
    }

    bookBuild(content_id : string): Promise<IAPI_Response<{inquiry_id : string}>>{
        return this.axiosTokenInstance.post(`/generate-book`,{content_id});
    }

    getbookBuildStatus(inquiry_id : string): Promise<IAPI_Response<{inquiry_result : string}>>{
        return this.axiosTokenInstance.get(`/generate-book/${inquiry_id}`);
    }

}