import { Action } from "redux";
import { EACTIONS } from "../../ActionEnum";

export interface ITheme_schema {
    sidebar: 'compact' | 'default';
    isSidebarHide: boolean;
}

export interface IThemeAction extends Action<EACTIONS> {
    payload: ITheme_schema | null;
}