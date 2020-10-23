export class Microservice {
    constructor(
        public serviceId?: string,
        public serviceName?: string,
        public serviceAddress?: string,
        public servicePort?: number,
        public serviceType?: string,
        public connectedServices?: Microservice[]
    ) { }
}
