import { combineReducers, createStore, ReducersMapObject, AnyAction } from 'redux';
import { redux_state } from './app_state';
import { reducer as UserReducer } from './reducer/user';
import { reducer as InternationalizationReducer } from './reducer/internationalization';
import { IUser } from '../model/model.user';
import { Reducer } from 'redux';
import { TInternationalization } from '../config/setup';
import { IToken } from '../model/model.token';
import { reducer as TokenReducer } from './reducer/token';
import { reducer as AuthenticationReducer } from './reducer/authentication';
import { reducer as NetworkStatusReducer } from './reducer/network-status';
import { reducer as ThemeReducer } from './reducer/theme';
//
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { NETWORK_STATUS } from '../enum/NetworkStatus';
import { ITheme_schema } from './action/theme/themeAction';
// import { TAuthentication_schema } from './action/authentication/authenticationAction';

const reducers: ReducersMapObject<redux_state, AnyAction> = {
  logged_in_user: UserReducer as Reducer<IUser | null, AnyAction>,
  internationalization: InternationalizationReducer as Reducer<TInternationalization, AnyAction>,
  token: TokenReducer as Reducer<IToken, AnyAction>,
  authentication: AuthenticationReducer as Reducer<string, AnyAction>,
  network_status: NetworkStatusReducer as Reducer<NETWORK_STATUS, AnyAction>,
  theme: ThemeReducer as Reducer<ITheme_schema, AnyAction>
}

const main_reducer = combineReducers(reducers);

const persistConfig = {
  key: 'root',
  storage,
  // blacklist: [],
}

const persistedReducer = persistReducer(persistConfig, main_reducer)

export const Store2 = createStore(persistedReducer);
export const persistor = persistStore(Store2);
