import { IUser } from '../model/model.user'
import { TInternationalization } from '../config/setup';
import { IToken } from '../model/model.token';
import { NETWORK_STATUS } from '../enum/NetworkStatus';
import { ITheme_schema } from './action/theme/themeAction';
// import { TAuthentication_schema } from './action/authentication/authenticationAction';

export interface redux_state {
    logged_in_user: IUser | null;
    internationalization: TInternationalization;
    token: IToken;
    authentication: string;
    network_status: NETWORK_STATUS;
    theme: ITheme_schema;
}
