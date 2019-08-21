import Axios from "axios";
import { IUser } from "../model/model.user";

export class UserService {
    instance = Axios.create({
        baseURL: '/api',
        // headers: {'X-Custom-Header': 'foobar'}
      });

    

    search(limit:number, offset:number):Promise<{data:IUser[]}>{
        return this.instance.post(``, {limit:limit, offset});
    }


    userById(userId:string){
          return this.instance.get(`/user/${userId}`);
    }
}