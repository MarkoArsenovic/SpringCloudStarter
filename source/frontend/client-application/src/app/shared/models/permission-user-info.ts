/**
 * For now used only as a part of UserInfo class,
 * object like this gets retrieved from backend,
 * when requesting user info.
 */
export class PermissionUserInfo {
    constructor(
        public serviceName?: string,
        public canDelete?: boolean,
        public canRead?: boolean,
        public canUpdate?: boolean,
        public canWrite?: boolean
    ){}
}
