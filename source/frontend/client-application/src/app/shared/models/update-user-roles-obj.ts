import { Role } from './role';

export class UpdateUserRolesObj {
    constructor(
        public id: number,
        public userRoles: Array<Role>
    ) { }
}
