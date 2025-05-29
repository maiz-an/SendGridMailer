import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('SENDGRID_API_KEY');

        if (!apiKey) {
            throw new Error('SendGrid API key is missing in .env');
        }

        sgMail.setApiKey(apiKey);
    }

    async sendEmail(to: string, name: string, buttonUrl: string, instaUrl: string) {

        const fromEmail = this.configService.get<string>('MAIL_FROM');

        if (!fromEmail) {
            throw new Error('MAIL_FROM is missing in .env fil');
        }

        // Find the template file path
        const templatePath = path.join(process.cwd(), 'src', 'mail', 'templates', 'invitation.html');

        // Read the HTML template file
        const templateHtml = fs.readFileSync(templatePath, 'utf-8');

        // Replace placeholder tags with actual data
        const finalHtml = templateHtml
            .replace(/{{name}}/g, name)
            .replace(/{{buttonUrl}}/g, buttonUrl)
            .replace(/{{instaUrl}}/g, instaUrl);

        // Create the email message
        const emailMessage = {
            to,
            from: fromEmail,
            subject: 'SendGrid Test Mail',
            text: `Hello ${name}, this is a maol from SendGrid, Visit: ${buttonUrl}, instagram: ${instaUrl}`,
            html: finalHtml,
        };

        try {
            // Send the email using SendGrid
            await sgMail.send(emailMessage);
            return { success: true, message: 'Email sent successfully!' };
        } catch (error: any) {
            console.error('SendGrid Error:', error.response?.body || error.message || error);
            throw new Error('Failed to send email');
        }
    }
}
