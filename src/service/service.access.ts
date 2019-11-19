import { BaseService } from './service.base';
import { Store2 } from '../redux/store';

export class AccessService extends BaseService {

    static checkAccess(ac: string): boolean {
        const user = Store2.getState().logged_in_user;
        if (!user) return false;
        return user.permissions.includes(ac);
    };

    static checkAllAccess( array : string[]): boolean {
        const User = Store2.getState().logged_in_user;
        if(array.length === 0 || !User ){return false}
        let valid = true;
        for (let i = 0; i < array.length; i++) {
            valid = valid &&  User.permissions.includes(array[i]);
            if(!valid){
                break;
            }
        }
        return valid;
    }

    static checkOneOFAllAccess( array : string[]): boolean {
        const User = Store2.getState().logged_in_user;
        if(array.length === 0 || !User ){return false}
        let valid = false;
        for (let i = 0; i < array.length; i++) {
            valid = User.permissions.includes(array[i]);
            if(valid){
                break;
            }
        }
        return valid;
    }
    
}