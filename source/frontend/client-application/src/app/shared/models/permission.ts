import { Role } from './role';
import { Service } from './service';

export class Permission {
    constructor(
        public id?: string,
        public canDelete?: boolean,
        public canRead?: boolean,
        public canUpdate?: boolean,
        public canWrite?: boolean,
        public role?: Role,
        public service?: Service
    ) { }
}
