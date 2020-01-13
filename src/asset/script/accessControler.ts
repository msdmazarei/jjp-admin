import { T_ITEM_NAME, CONDITION_COMBINE, EXTERA_FUN_NAME } from '../../enum/T_ITEM_NAME';
import { CHECKTYPE } from '../../enum/T_ITEM_NAME';
import { AccessService } from '../../service/service.access';
import { TPERMISSIONS } from '../../enum/Permission';

export abstract class permissionChecker {

    private static permissions_by_item: { item: string, permissions: string[] }[] =
        [
            { item: T_ITEM_NAME.dashboard, permissions: [TPERMISSIONS.REPORT_GET_PREMIUM, TPERMISSIONS.REPORT_GET_PRESS] },
            { item: T_ITEM_NAME.bookManage, permissions: [] },
            { item: T_ITEM_NAME.bookManageAllTools, permissions: [TPERMISSIONS.BOOK_DELETE_PREMIUM, TPERMISSIONS.BOOK_EDIT_PREMIUM,TPERMISSIONS.BOOK_DELETE_PRESS, TPERMISSIONS.BOOK_EDIT_PRESS, TPERMISSIONS.PRICE_GET_PREMIUM]},
            { item: T_ITEM_NAME.bookManageDeleteTool, permissions: [TPERMISSIONS.BOOK_DELETE_PREMIUM,TPERMISSIONS.BOOK_DELETE_PRESS]},
            { item: T_ITEM_NAME.bookManageUpdateTool, permissions: [TPERMISSIONS.BOOK_EDIT_PREMIUM,TPERMISSIONS.BOOK_EDIT_PRESS]},
            { item: T_ITEM_NAME.bookManagePriceFieldInGridAndTool, permissions: [TPERMISSIONS.PRICE_GET_PREMIUM]},
            { item: T_ITEM_NAME.bookManagePriceAddAndEditSuperAdmin, permissions: [TPERMISSIONS.PRICE_ADD_PREMIUM, TPERMISSIONS.PRICE_EDIT_PREMIUM]},
            { item: T_ITEM_NAME.bookManagePriceAddAndEditPress, permissions: [TPERMISSIONS.PRICE_ADD_PRESS, TPERMISSIONS.PRICE_EDIT_PRESS]},
            { item: T_ITEM_NAME.bookManagePriceEditSuperAdmin, permissions: [TPERMISSIONS.PRICE_EDIT_PREMIUM]},
            { item: T_ITEM_NAME.bookManagePriceEditPress, permissions: [TPERMISSIONS.PRICE_EDIT_PRESS]},
            { item: T_ITEM_NAME.bookManageAddBook, permissions: [TPERMISSIONS.BOOK_ADD_PREMIUM,TPERMISSIONS.BOOK_ADD_PRESS]},
            { item: T_ITEM_NAME.bookManageAddBookSuperAdmin, permissions: [TPERMISSIONS.BOOK_ADD_PREMIUM]},
            { item: T_ITEM_NAME.bookManageAddBookPress, permissions: [TPERMISSIONS.BOOK_ADD_PRESS]},
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

    static check_all_permission_of_item(items: T_ITEM_NAME[]): boolean {
        let permissions: string[] | null = permissionChecker.permission_detect_by_selected_item(items[0])
        if (permissions === null || permissions.length === 0) {
            return true;
        } else {
            return AccessService.checkAllAccess(permissions);
        }
    }

    static check_one_of_all_permission_of_item(items: T_ITEM_NAME[]): boolean {
        let permissions: string[] | null = permissionChecker.permission_detect_by_selected_item(items[0])
        if (permissions === null || permissions.length === 0) {
            return true;
        } else {
            return AccessService.checkOneOFAllAccess(permissions);
        }
    }

    static check_one_of_items_all_permission(items: T_ITEM_NAME[]): boolean {
        let result: boolean = false;
        for (let i = 0; i < items.length; i++) {
            let permissions: string[] | null = permissionChecker.permission_detect_by_selected_item(items[i]);
            if (permissions === null || permissions.length === 0) {
                result = true;
            } else {
                result = AccessService.checkAllAccess(permissions);
            }
            if (result === true) {
                break;
            }
        }
        return result;
    }

    static is_allow(items: T_ITEM_NAME[], check: CHECKTYPE): boolean {
        if (check === CHECKTYPE.ALL) {
            return permissionChecker.check_all_permission_of_item(items);
        } else if (check === CHECKTYPE.ONE_OF_ALL) {
            return permissionChecker.check_one_of_all_permission_of_item(items);
        } else {
            return permissionChecker.check_one_of_items_all_permission(items);
        }
    };

    static function_result_returner(func: EXTERA_FUN_NAME | undefined, data?: any): boolean {
        if (func === undefined) {
            return false;
        } else if (func === EXTERA_FUN_NAME.orderCheckoutAccess) {
            return permissionChecker.orderCheckoutAccess(data);
        } else {
            return false;
        }
    }

    //// start extera access function check without permissiom ////

    static orderCheckoutAccess(data?: any): boolean {
        if (data === undefined) {
            return false;
        }
        if (data.status === "Invoiced") {
            return false;
        }
        return true;
    }

    //// end extera access function check without permissiom ////

    static is_allow_item_render(items: T_ITEM_NAME[], check: CHECKTYPE, condition_combine: CONDITION_COMBINE, func?: EXTERA_FUN_NAME | undefined, data?: any): boolean {
        let permission_result: boolean = permissionChecker.is_allow(items, check);
        let data_access_result: boolean = condition_combine === CONDITION_COMBINE.DOSE_NOT_HAVE ? true : permissionChecker.function_result_returner(func, data);

        if (condition_combine === CONDITION_COMBINE.DOSE_NOT_HAVE) {
            return permission_result;
        } else if (condition_combine === CONDITION_COMBINE.AND) {
            if (permission_result === true && data_access_result === true) {
                return true;
            } else {
                return false;
            }
        } else {
            if (permission_result === true || data_access_result === true) {
                return true;
            } else {
                return false;
            }
        }
    }
}
