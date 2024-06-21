import { Get, JsonController, Post } from "routing-controllers";

@JsonController('/account')
export class AccountController {

    @Post()
    async createAcccount() {
        
    }

    @Get()
    async getAccountBalance() {
        
    }
}