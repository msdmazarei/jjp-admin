import { T_ITEM_NAME, CONDITION_COMBINE, EXTERA_FUN_NAME } from '../../enum/T_ITEM_NAME';
import { CHECKTYPE } from '../../enum/T_ITEM_NAME';
import { AccessService } from '../../service/service.access';
import { TPERMISSIONS } from '../../enum/Permission';

export abstract class permissionChecker {

    private static permissions_by_item: { item: string, permissions: string[] }[] =
        [
            { item: T_ITEM_NAME.dashboard, permissions: [TPERMISSIONS.REPORT_GET_PREMIUM, TPERMISSIONS.REPORT_GET_PRESS] },
            { item: T_ITEM_NAME.bookManage, permissions: [] },
            { item: T_ITEM_NAME.bookSave, permissions: [] },
            { item: T_ITEM_NAME.bookEdit, permissions: [] },
            { item: T_ITEM_NAME.bookContentManage, permissions: [] },
            { item: T_ITEM_NAME.bookContentSave, permissions: [] },
            { item: T_ITEM_NAME.bookContentEdit, permissions: [] },
            { item: T_ITEM_NAME.personManage, permissions: [] },
            { item: T_ITEM_NAME.personSave, permissions: [] },
            { item: T_ITEM_NAME.personEdit, permissions: [] },
            { item: T_ITEM_NAME.userManage, permissions: [] },
            { item: T_ITEM_NAME.userSave, permissions: [] },
            { item: T_ITEM_NAME.userEdit, permissions: [] },
            { item: T_ITEM_NAME.commentManage, permissions: [] },
            { item: T_ITEM_NAME.orderManage, permissions: [] },
            { item: T_ITEM_NAME.orderSave, permissions: [] },
            { item: T_ITEM_NAME.orderEdit, permissions: [] },
            { item: T_ITEM_NAME.groupManage, permissions: [] },
            { item: T_ITEM_NAME.groupSave, permissions: [] },
            { item: T_ITEM_NAME.groupEdit, permissions: [] },
            { item: T_ITEM_NAME.transactionManage, permissions: [] },
        ];

    static permission_detect_by_selected_item(item: T_ITEM_NAME): string[] | null {
        for (let i = 0; i < permissionChecker.permissions_by_item.length; i++) {
            if (permissionChecker.permissions_by_item[i].item === item) {
                return permissionChecker.permissions_by_item[i].permissions;
            };
        }
        return null;
    };

    static is_allow(item: T_ITEM_NAME, check: CHECKTYPE): boolean {
        const selectedItemPermissions: string[] | null = permissionChecker.permission_detect_by_selected_item(item);

        if (selectedItemPermissions === null) {
            return true;
        } else if (check === CHECKTYPE.ALL) {
            if (AccessService.checkAllAccess(selectedItemPermissions) === true) {
                return true;
            } else {
                return false;
            };
        } else if (check === CHECKTYPE.ONE_OF_ALL) {
            if (AccessService.checkOneOFAllAccess(selectedItemPermissions) === true) {
                return true;
            } else {
                return false;
            };
        } else {
            return false;
        };
    };

    static is_allow_item_render(item: T_ITEM_NAME[], check: CHECKTYPE, condition_combine: CONDITION_COMBINE, func?: EXTERA_FUN_NAME, data?: any): boolean {
        if (condition_combine === CONDITION_COMBINE.DOSE_NOT_HAVE) {
            if (item.length === 0) {
                return true;
            } else if (item.length === 1) {
                let newCheck: CHECKTYPE = check;
                if (check === CHECKTYPE.ONE_OF_ITEM_ALL) {
                    newCheck = CHECKTYPE.ALL;
                };
                return permissionChecker.is_allow(item[0], newCheck);
            } else {
                let result: boolean = false;
                for (let i = 0; i < item.length; i++) {
                    result = permissionChecker.is_allow(item[i], CHECKTYPE.ALL);
                    if (result === true) {
                        break;
                    }
                };
                return result;
            }
        } else if (condition_combine === CONDITION_COMBINE.OR) {
            if (func === undefined) {
                if (item.length === 0) {
                    return true;
                } else if (item.length === 1) {
                    let newCheck: CHECKTYPE = check;
                    if (check === CHECKTYPE.ONE_OF_ITEM_ALL) {
                        newCheck = CHECKTYPE.ALL;
                    };
                    return permissionChecker.is_allow(item[0], newCheck);
                } else {
                    let result: boolean = false;
                    for (let i = 0; i < item.length; i++) {
                        result = permissionChecker.is_allow(item[i], CHECKTYPE.ALL);
                        if (result === true) {
                            break;
                        }
                    };
                    return result;
                }
            } else {
                let or_result: boolean = permissionChecker.function_result_returner(func, data);
                if (or_result === true) {
                    return or_result;
                } else {
                    if (item.length === 0) {
                        return true;
                    } else if (item.length === 1) {
                        let newCheck: CHECKTYPE = check;
                        if (check === CHECKTYPE.ONE_OF_ITEM_ALL) {
                            newCheck = CHECKTYPE.ALL;
                        };
                        return permissionChecker.is_allow(item[0], newCheck);
                    } else {
                        let result: boolean = false;
                        for (let i = 0; i < item.length; i++) {
                            result = permissionChecker.is_allow(item[i], CHECKTYPE.ALL);
                            if (result === true) {
                                break;
                            }
                        };
                        return result;
                    }
                }
            }
        } else {
            if (func === undefined) {
                if (item.length === 0) {
                    return true;
                } else if (item.length === 1) {
                    let newCheck: CHECKTYPE = check;
                    if (check === CHECKTYPE.ONE_OF_ITEM_ALL) {
                        newCheck = CHECKTYPE.ALL;
                    };
                    return permissionChecker.is_allow(item[0], newCheck);
                } else {
                    let result: boolean = false;
                    for (let i = 0; i < item.length; i++) {
                        result = permissionChecker.is_allow(item[i], CHECKTYPE.ALL);
                        if (result === true) {
                            break;
                        }
                    };
                    return result;
                }
            } else {
                let and_result: boolean = permissionChecker.function_result_returner(func, data);
                if (and_result === false) {
                    return and_result;
                } else {
                    if (item.length === 0) {
                        return true && and_result;
                    } else if (item.length === 1) {
                        let newCheck: CHECKTYPE = check;
                        if (check === CHECKTYPE.ONE_OF_ITEM_ALL) {
                            newCheck = CHECKTYPE.ALL;
                        };
                        return permissionChecker.is_allow(item[0], newCheck) && and_result;
                    } else {
                        let result: boolean = false;
                        for (let i = 0; i < item.length; i++) {
                            result = permissionChecker.is_allow(item[i], CHECKTYPE.ALL);
                            if (result === true) {
                                break;
                            }
                        };
                        return result && and_result;
                    }
                }
            }
        }
    }

    static function_result_returner(func: EXTERA_FUN_NAME, data?: any): boolean {
        if (func === EXTERA_FUN_NAME.orderCheckoutAccess) {
            permissionChecker.orderCheckoutAccess(data);
        }
        return true;
    }

    //// start extera access function check without permissiom ////

    static orderCheckoutAccess(data?: any): boolean {
        if(data === undefined){
            return false;
        }
        if (data.status === "Invoiced") {
            return false;
        }
        return true;
    }

    //// end extera access function check without permissiom ////
}
