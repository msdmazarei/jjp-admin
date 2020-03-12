interface IRouteBase {
    name: string;
    sidebarVisible: boolean;
    breadcrumbVisible: boolean;
    icon?: string;
}

export interface IRoute extends IRouteBase {
    path: string; // href for app outside link
    // pageTitle?: string;
    pageTitleVisible: boolean;
    // permission: () => boolean;
    isMe?: (path: string) => boolean;
}

export interface IRouteParent extends IRouteBase {
    children: Array<IRoute | IRouteParent>;
    link?: string;
}

export type IAppRoute = Array<IRoute | IRouteParent>;

export type TBreadcrumbItem = IRouteParent | (IRoute & { itIsMe: boolean });
export type TBreadcrumb = Array<TBreadcrumbItem>;

export class AppRoute {
    private static readonly routes: IAppRoute = [
        //dashboard
        {
            path: '/dashboard',
            name: 'dashboard',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-dashboard',
            isMe: (path) => {
                if (path.includes('dashboard')) return true;
                return false;
            }
        },
        //book
        {
            name: 'book',
            sidebarVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-book',
            children: [
                {
                    path: '/book/manage',
                    name: 'list',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-list-ol'
                },
                {
                    path: '/book/create',
                    name: 'create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus'
                },
            ]
        },
        // book generator
        {
            name: 'content',
            sidebarVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-upload',
            children: [
                {
                    path: '/book_generator/manage',
                    name: 'list',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-list-ol'
                },
                {
                    path: '/book_generator/create',
                    name: 'create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus'
                },
            ]
        },
        //person
        {
            name: 'person',
            sidebarVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-id-card',
            children: [
                {
                    path: '/person/manage',
                    name: 'list',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-list-ol'
                },
                {
                    path: '/person/create',
                    name: 'create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus'
                },
            ]
        },
        //user
        {
            name: 'user',
            sidebarVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-user',
            children: [
                {
                    path: '/user/manage',
                    name: 'list',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-list-ol'
                },
                {
                    path: '/user/create',
                    name: 'create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus'
                },
            ]
        },
        //comment
        {
            path: '/comment/manage',
            name: 'comment',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-comment'
        },
        //order
        {
            name: 'order',
            sidebarVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-shopping-cart',
            children: [
                {
                    path: '/order/manage',
                    name: 'list',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-list-ol'
                },
                {
                    path: '/order/create',
                    name: 'create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus'
                },
            ]
        },
        //group
        {
            name: 'group',
            sidebarVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-users',
            children: [
                {
                    path: '/group/manage',
                    name: 'list',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-list-ol'
                },
                {
                    path: '/group/create',
                    name: 'create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus'
                },
            ]
        },
        //transaction
        {
            path: '/transaction/manage',
            name: 'transaction',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-list-alt'
        },
        //pressAccounting
        {
            name: 'Publishers_bills',
            sidebarVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-money',
            children: [
                {
                    path: '/press_accounts/manage',
                    name: 'list',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-list-ol'
                },
                {
                    path: '/record_new_payment',
                    name: 'create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus'
                },
            ]
        },
    ];

    static getRoutes(): IAppRoute {
        return this.routes;
    }

    static getAllChildrenPath(parentRoute: IRouteParent): Array<string> {
        const list: string[] = [];
        const getPath = (children: IRouteParent['children']) => {
            children.forEach(item => {
                if ((item as any).children) {
                    getPath((item as any).children);
                } else {
                    list.push((item as IRoute).path);
                }
            });
        };
        getPath(parentRoute.children);
        return list;
    }

    static getRouteByPath(path: string): IRoute | undefined {
        let rtn: IRoute | undefined;

        const findRoute = (rs: Array<IRouteParent | IRoute>) => {
            for (let i = 0; i < rs.length; i++) {
                const r = rs[i];
                if (r.hasOwnProperty('path')) {
                    const cr = r as IRoute;
                    if (cr.isMe && cr.isMe(path)) {
                        rtn = cr;
                        break;
                    } else if (cr.path === path) {
                        rtn = cr;
                        break;
                    }
                } else if (r.hasOwnProperty('children')) {
                    findRoute((r as IRouteParent).children);
                    if (rtn) break;
                }
            }
        };
        findRoute(this.routes);

        return rtn;
    }

    static getBreadcrumbsByPath(path: string): TBreadcrumb {
        const list: TBreadcrumb = [];
        let found = false;

        const findRoute = (rs: Array<IRouteParent | IRoute>) => {
            for (let i = 0; i < rs.length; i++) {
                const r = rs[i];
                if (r.hasOwnProperty('path')) {
                    const cr = r as IRoute;
                    if (cr.isMe && cr.isMe(path)) {
                        list.push({ ...cr, itIsMe: true });
                        found = true;
                        break;
                    } else if (cr.path === path) {
                        list.push({ ...cr, itIsMe: true });
                        found = true;
                        break;
                    }
                } else if (r.hasOwnProperty('children')) {
                    findRoute((r as IRouteParent).children);
                    if (found) {
                        list.unshift(r as IRouteParent);
                        break;
                    }
                }
            }
        };
        findRoute(this.routes);

        return list;
    }

}
