import { AllPropsSameType } from '../types/all-props-same-type';
import { NotificationDurationRange } from '../interfaces/notification-duration-range';
import { IamServiceData } from '../interfaces/iam-service-data';

export const LOCAL_STORAGE_KEYS: AllPropsSameType<string> = {
    loginToken: 'loginToken',
    userInfo: 'userInfo',
    userPermissions: 'userPermissions'
}

export const PUBLIC_ROUTES: AllPropsSameType<string> = {
    login: 'iam-service/user/login',
    register: 'iam-service/user/register',
    forgotPassword: 'iam-service/user/forgot-password',
    resetPassword: 'iam-service/user/reset-password'
}

export const AUTHORIZATION_HEADER_KEY: string = 'Authorization';

// Headers used to disable caching: https://stackoverflow.com/questions/53232382/how-to-disable-caching-with-httpclient-get-in-angular-6
export const CACHE_DISABLE_HEADERS: AllPropsSameType<string> = {
    'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
    'Pragma': 'no-cache',
    'Expires': '0'
}

interface BootstrapBreakpointRange {
    minWidth: number,
    maxWidth: number
}

/**
 * Based on https://getbootstrap.com/docs/4.3/layout/overview/#responsive-breakpoints
 * 
 * CAUTION!!! ALWAYS USE minWidth ONLY WITH >=, AND maxWidth ONLY WITH < OPERATORS TO AVOID OVERLAPPING, VALUES THAT DONT
 * BELONG TO ANY RANGE AND POSIBLE SIMILAR PROBLEMS!!!
 * SIMILAR APPROACH IS USED IN BOOTSTRAP MOBILE FIRST (WITH min-width)
 * AND DESKTOP FIRST MEDIA QUERIES (WITH max-width AND EXTRA .98px) IN THE LINK ABOVE. 
 * EXPLANATION FOR EXTRA .98px:
 * https://stackoverflow.com/questions/51566916/why-does-bootstrap-use-a-0-02px-difference-between-screen-size-thresholds-in-its,
 * https://stackoverflow.com/questions/54596219/why-do-some-max-width-media-queries-use-a-98px
 */
export const BOOTSTRAP_RESPONSIVE_BREAKPOINTS : {
    extraSmallDevices: BootstrapBreakpointRange,
    smallDevices: BootstrapBreakpointRange,
    mediumDevices: BootstrapBreakpointRange,
    largeDevices: BootstrapBreakpointRange,
    extraLargeDevices: BootstrapBreakpointRange
} = {
    //portrait phones
    extraSmallDevices: {
        minWidth: 0,
        maxWidth: 576
    },
    //landscape phones
    smallDevices: {
        minWidth: 576,
        maxWidth: 768
    },
    //tablets
    mediumDevices: {
        minWidth: 768,
        maxWidth: 992
    },
    //desktops
    largeDevices: {
        minWidth: 992,
        maxWidth: 1200
    },
    //large desktops
    extraLargeDevices: {
        minWidth: 1200,
        maxWidth: Number.POSITIVE_INFINITY
    }
}

export const SNACK_BAR_DEFAULT_ERROR_MESSAGE: string = 'Something went wrong, request failed!';

export const NOTIFICATION_EXTRA_SHORT_DURATION: number = 3000;

export const NOTIFICATION_SHORT_DURATION: number = 5000;

export const NOTIFICATION_MEDIUM_DURATION: number = 7000;

export const NOTIFICATION_LONG_DURATION: number = 9000;

export const NOTIFICATION_EXTRA_LONG_DURATION: number = 12000;

export const NOTIFICATION_EXTRA_SHORT_DURATION_RANGE: NotificationDurationRange = {
    minChar: 1,
    maxChar: 30,
    duration: NOTIFICATION_EXTRA_SHORT_DURATION
}

export const NOTIFICATION_SHORT_DURATION_RANGE: NotificationDurationRange = {
    minChar: 30,
    maxChar: 50,
    duration: NOTIFICATION_SHORT_DURATION
}

export const NOTIFICATION_MEDIUM_DURATION_RANGE: NotificationDurationRange = {
    minChar: 50,
    maxChar: 70,
    duration: NOTIFICATION_MEDIUM_DURATION
}

export const NOTIFICATION_LONG_DURATION_RANGE: NotificationDurationRange = {
    minChar: 70,
    maxChar: 100,
    duration: NOTIFICATION_LONG_DURATION
}

export const NOTIFICATION_EXTRA_LONG_DURATION_RANGE: NotificationDurationRange = {
    minChar: 100,
    maxChar: Number.POSITIVE_INFINITY,
    duration: NOTIFICATION_EXTRA_LONG_DURATION
}

export const IAM_SERVICES_DATA: AllPropsSameType<IamServiceData> = {
    iam: { name: 'IAM', relatedUrls: ['/iam/roles', '/iam/services', '/iam/users', '/iam/permissions'] }
}

export const PERMISSION_STRINGS: AllPropsSameType<string> = {
    canRead: '_canRead',
    canWrite: '_canWrite',
    canUpdate: '_canUpdate',
    canDelete: '_canDelete'
}
