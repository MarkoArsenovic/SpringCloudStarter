import { Role } from './role';

export class User {
    constructor(
        public id?: number,
        public username?: string,
        public name?: string,
        public lastname?: string,
        public email?: string,
        public userRoles?: Array<Role>,
    ){}
}
