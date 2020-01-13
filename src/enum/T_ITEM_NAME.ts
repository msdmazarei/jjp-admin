export enum T_ITEM_NAME {
    dashboard = 'dashboard',
    // start book
    bookManage = 'bookManage',
    bookManageAllTools = 'bookManageAllTools',
    bookManageDeleteTool = 'bookManageDeleteTool',
    bookManageUpdateTool = 'bookManageUpdateTool',
    bookManagePriceFieldInGridAndTool = 'bookManagePriceFieldInGridAndTool',
    bookManagePriceAddAndEditSuperAdmin = 'bookManagePriceAddAndEditSuperAdmin',
    bookManagePriceAddAndEditPress = 'bookManagePriceAddAndEditPress',
    bookManagePriceEditSuperAdmin = 'bookManagePriceEditSuperAdmin',
    bookManagePriceEditPress = 'bookManagePriceEditPress',
    bookManageAddBook = 'bookManageAddBook',
    bookManageAddBookSuperAdmin = 'bookManageAddBookSuperAdmin',
    bookManageAddBookPress = 'bookManageAddBookPress',
    bookSave = 'bookSave',
    bookEdit = 'bookEdit',
    // end book
    // start book content
    bookContentManage = 'bookContentManage',
    bookContentSave = 'bookContentSave',
    bookContentEdit = 'bookContentEdit',
    // end book content
    // start person
    personManage = 'personManage',
    personSave = 'personSave',
    personEdit = 'personEdit',
    // end person
    // start user
    userManage = 'userManage',
    userSave = 'userSave',
    userEdit = 'userEdit',
    // end user
    // start comment
    commentManage = 'commentManage',
    // end comment
    // start order
    orderManage = 'orderManage',
    orderSave = 'orderSave',
    orderEdit = 'orderEdit',
    // end order
    // start group
    groupManage = 'groupManage',
    groupSave = 'groupSave',
    groupEdit = 'groupEdit',
    // end group
    // start transaction
    transactionManage = 'transactionManage',
    // end transaction
}

export enum CHECKTYPE {
    ALL = 'ALL',
    ONE_OF_ALL = 'ONE_OF_ALL',
    ONE_OF_ITEM_ALL = 'ONE_OF_ITEM_ALL',
}

export enum  CONDITION_COMBINE {
    DOSE_NOT_HAVE = 'DOSE_NOT_HAVE',
    OR = 'OR',
    AND = 'AND',
}

export enum  EXTERA_FUN_NAME {
    orderCheckoutAccess = 'orderCheckoutAccess',
}