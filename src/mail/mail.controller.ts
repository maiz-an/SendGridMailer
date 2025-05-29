import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) { }

    @Post('send')
    async sendMail(
        @Body() requestBody: {
            to: string;
            name: string;
            buttonUrl: string;
            instaUrl: string;
        }
    ) {
        return this.mailService.sendEmail(
            requestBody.to,
            requestBody.name,
            requestBody.buttonUrl,
            requestBody.instaUrl
        );
    }
}
