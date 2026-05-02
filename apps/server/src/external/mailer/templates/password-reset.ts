/**
 * @file password-reset.ts
 * @description Transactional email template for password reset requests.
 * Sent when the user initiates a "forgot my password" flow.
 *
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
    urlFallback
} from './_base';

export interface PasswordResetTemplateOptions {
    /** User's display name */
    userName: string;
    /** Full password reset URL (with embedded token) */
    resetUrl: string;
    /** Token expiry in human-readable format, e.g. "1 hora" */
    expiresIn?: string;
    /** IP address of the request origin, for security context */
    requestIp?: string;
}

export const PASSWORD_RESET_SUBJECT = 'Redefinição de senha — Astra';

/**
 * Builds the HTML string for the password reset request email.
 */
export function passwordResetTemplate({
    userName,
    resetUrl,
    expiresIn = '1 hora',
    requestIp
}: PasswordResetTemplateOptions): string {
    const content = [
        heading('Redefinição de senha', '🔑'),

        paragraph(`Olá, <strong>${userName}</strong>!`),
        paragraph(
            'Recebemos uma solicitação para redefinir a senha da sua conta na <strong>Astra</strong>. ' +
                'Clique no botão abaixo para criar uma nova senha.'
        ),

        ctaButton('Redefinir minha senha', resetUrl),
        urlFallback(resetUrl),

        divider(),

        noticeBox(
            `Este link expira em <strong>${expiresIn}</strong> e só pode ser usado uma vez. ` +
                'Após a redefinição, todos os dispositivos serão desconectados automaticamente.'
        ),

        requestIp
            ? noticeBox(
                  `Esta solicitação foi feita a partir do IP <strong>${requestIp}</strong>. ` +
                      'Se não foi você, recomendamos verificar o acesso à sua conta imediatamente.',
                  'warning'
              )
            : '',

        paragraph(
            'Se você não solicitou a redefinição de senha, ignore este e-mail. ' +
                'Sua senha permanecerá a mesma e nenhuma alteração será feita.',
            true
        )
    ].join('');

    return baseTemplate({
        title: 'Redefinição de senha — Astra',
        content,
        footerNote:
            'Por segurança, nunca compartilhe este link. A equipe Astra jamais pedirá sua senha.'
    });
}
