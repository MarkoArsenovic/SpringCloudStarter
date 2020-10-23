import { HttpErrorResponse } from '@angular/common/http';

export class CustomizedHttpErrorResponse extends HttpErrorResponse {

    public customFields: {
        messageShown: boolean,
        blockMessageShowing: boolean
    } = {
        messageShown: false,
        blockMessageShowing: false
    }

    constructor(
        error: HttpErrorResponse
    ){
        super(error);
    }
}
