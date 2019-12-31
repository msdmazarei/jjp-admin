import { T_ITEM_NAME } from '../../enum/T_ITEM_NAME';
import { CHECKTYPE } from '../../enum/T_ITEM_NAME';
import { AccessService } from '../../service/service.access';
import { TPERMISSIONS } from '../../enum/Permission';

export abstract class permissionChecker {

    private static permissions_by_item: { item: string, permissions: string[] }[] =
        [
            { item: T_ITEM_NAME.dashboard, permissions: [TPERMISSIONS.REPORT_GET_PREMIUM,TPERMISSIONS.REPORT_GET_PRESS] },
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

    static is_allow_item_render(item: T_ITEM_NAME, check: CHECKTYPE): boolean {
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
}
