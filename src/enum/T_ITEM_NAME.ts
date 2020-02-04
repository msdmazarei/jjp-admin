export enum T_ITEM_NAME {
    dashboard = 'dashboard',
    advancedDashboard = 'advancedDashboard',
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
    bookSavePriceAdd = 'bookSavePriceAdd',
    bookEdit = 'bookEdit',
    bookEditPriceEdit = 'bookEditPriceEdit',
    // end book
    // start book content
    bookContentManage = 'bookContentManage',
    bookContentManageAllTools = 'bookContentManageAllTools',
    bookContentManageDeleteTool = 'bookContentManageDeleteTool',
    bookContentManageUpdateTool = 'bookContentManageUpdateTool',
    bookContentManageGenerateTool = 'bookContentManageGenerateTool',
    bookContentManageGetGrid = 'bookContentManageGetGrid',
    bookContentManageGetGridSuperAdmin = 'bookContentManageGetGridSuperAdmin',
    bookContentSave = 'bookContentSave',
    bookContentEdit = 'bookContentEdit',
    // end book content
    // start person
    personManage = 'personManage',
    personManageGetGrid = 'personManage',
    personManageAllTools = 'personManage',
    personManageDeleteTool = 'personManage',
    personManageUpdateTool = 'personManage',
    personSave = 'personSave',
    personEdit = 'personEdit',
    quickPersonSave = 'quickPersonSave',
    // end person
    // start user
    userManage = 'userManage',
    userManageGetGrid = 'userManageGetGrid',
    userManageAllTools = 'userManageAllTools',
    userManageDeleteTool = 'userManageDeleteTool',
    userManageUpdateTool = 'userManageUpdateTool',
    userManageAddGroupTool = 'userManageAddGroupTool',
    userManageGetUserCreditTool = 'userManageGetUserCreditTool',
    userManageJustAddGroupToUser = 'userManageJustAddGroupToUser',
    userManageJustDeleteGroupFromUser = 'userManageJustDeleteGroupFromUser',
    userSave = 'userSave',
    userEdit = 'userEdit',
    // end user
    // start comment
    commentManage = 'commentManage',
    commentManageGetGrid = 'commentManageGetGrid',
    commentManageAllTools = 'commentManageAllTools',
    commentManageDeleteTool = 'commentManageDeleteTool',
    commentManageShowCommentTool = 'commentManageShowCommentTool',
    // end comment
    // start order
    orderManage = 'orderManage',
    orderManageGetGird = 'orderManageGetGird',
    orderManageAllTools = 'orderManageAllTools',
    orderManageDeleteTool = 'orderManageDeleteTool',
    orderManageUpdateTool = 'orderManageUpdateTool',
    orderManageShowOrderTool = 'orderManageShowOrderTool',
    orderManageGetInvoiceTool = 'orderManageGetInvoiceTool',
    orderSave = 'orderSave',
    orderEdit = 'orderEdit',
    // end order
    // start group
    groupManage = 'groupManage',
    groupManageGetGrid = 'groupManageGetGrid',
    groupManageAllTools = 'groupManageAllTools',
    groupManageDeleteTool = 'groupManageDeleteTool',
    groupManageAddPermissionTool = 'groupManageAddPermissionTool',
    groupManageAddUserTool = 'groupManageAddUserTool',
    groupManageJustAddUserToGroup = 'groupManageJustAddUserToGroup',
    groupManageJustDeleteUserFromGroup = 'groupManageJustDeleteUserFromGroup',
    groupSave = 'groupSave',
    groupEdit = 'groupEdit',
    // end group
    // start transaction
    transactionManage = 'transactionManage',
    transactionManageGetGrid = 'transactionManageGetGrid',
    transactionManageAllTools = 'transactionManageAllTools',
    transactionManageDeleteTool = 'transactionManageDeleteTool',
    // end transaction
    // start pressAccounting
    pressAccountingManage = 'pressAccountingManage',
    pressAccountingManageGrid = 'pressAccountingManageGrid',
    pressAccountingManageAllTools = 'pressAccountingManageAllTools',
    pressAccountingManageDeleteTool = 'pressAccountingManageDeleteTool',
    pressAccountingManageUpdateTool = 'pressAccountingManageUpdateTool',
    pressAccountingManageRecordNewPaymentTool = 'pressAccountingManageRecordNewPaymentTool',
    pressAccountingManagePressAccountListTool = 'pressAccountingManagePressAccountListTool',
    pressAccountingRecordNewPayment = 'pressAccountingRecordNewPayment',
    pressAccountList = 'pressAccountList',
    pressAccountListGrid = 'pressAccountListGrid',
    pressAccountListTools = 'pressAccountListTools',
    pressAccountListDeleteTool = 'pressAccountListDeleteTool',
    pressAccountListUpdateTool = 'pressAccountListUpdateTool',
    // end pressAccounting
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