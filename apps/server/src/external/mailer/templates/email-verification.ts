/**
 * @file email-verification.ts
 * @description Transactional email template for e-mail address verification.
 * Sent after registration to confirm the user's e-mail address.
 * @author Lucas
 * @license MIT
 */

import {
    baseTemplate,
    heading,
    paragraph,
    divider,
    ctaButton,
    noticeBox,
    urlFallback,
    codeBlock
} from './_base';
import ms from 'ms';

export interface EmailVerificationTemplateOptions {
    /** User's display name */
    userName: string;
    /** Verification link (full URL) */
    verificationUrl: string;
    /** Optional OTP code as alternative to the link */
    otp?: string;
    /** Token expiry in milisseconds */
    expiresIn: number;
}

export const EMAIL_VERIFICATION_SUBJECT = 'Confirme seu e-mail — Astra';

/**
 * Builds the HTML string for the e-mail verification email.
 */
export function emailVerificationTemplate({
    userName,
    verificationUrl,
    otp,
    expiresIn
}: EmailVerificationTemplateOptions): string {
    const content = [
        heading('Confirme seu e-mail', '✉️'),

        paragraph(`Olá, <strong>${userName}</strong>!`),
        paragraph(
            'Obrigado por criar sua conta na <strong>Astra</strong>. Para ativar o acesso, ' +
                'precisamos verificar o endereço de e-mail informado. Basta clicar no botão abaixo.'
        ),

        ctaButton('Verificar meu e-mail', verificationUrl),

        otp
            ? [
                  paragraph('Ou insira o código de verificação diretamente no aplicativo:', true),
                  codeBlock(otp)
              ].join('')
            : '',

        urlFallback(verificationUrl),
        divider(),

        noticeBox(
            `Este link é válido por <strong>${ms(expiresIn)}</strong>. ` +
                'Após expirar, você ainda poderá solicitar um novo link.'
        ),

        paragraph(
            'Se você não criou uma conta na Astra, ignore este e-mail — ' +
                'nenhuma ação adicional é necessária.',
            true
        )
    ].join('');

    return baseTemplate({
        title: 'Confirme seu e-mail — Astra',
        content,
        footerNote: 'Por razões de segurança, nunca compartilhe este link com ninguém.'
    });
}
