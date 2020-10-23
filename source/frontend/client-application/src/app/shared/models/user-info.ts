import { User } from './user';
import { PermissionUserInfo } from './permission-user-info';

export class UserInfo {
    constructor(
        public user?: User,
        public permissions?: Array<PermissionUserInfo>
    ){}
}
