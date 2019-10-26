import { BaseService } from './service.base';
import { Store2 } from '../redux/store';

export class AccessService extends BaseService {

    static checkAccess(ac: string): boolean {
        const user = Store2.getState().logged_in_user;
        if (!user) return false;
        return user.permissions.includes(ac);
    }

}