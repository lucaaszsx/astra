/**
 * @file password-changed.ts
 * @description Transactional email template for password change confirmation.
 * Sent immediately after a successful password reset or manual password change.
 * Acts as a security alert — if the user did not make this change, they can act fast.
 * @author Lucas
 * @license MIT
 */

import { baseTemplate, heading, paragraph, divider, ctaButton, noticeBox } from './_base';

export interface PasswordChangedTemplateOptions {
    /** User's display name */
    userName: string;
    /** Timestamp of the change in human-readable format, e.g. "02/05/2025 às 14:32" */
    changedAt: string;
    /** IP address from which the change was made */
    changedFromIp?: string;
    /** Support/contact URL for users who didn't make the change */
    supportUrl?: string;
}

export const PASSWORD_CHANGED_SUBJECT = 'Sua senha foi alterada — Astra';

/**
 * Builds the HTML string for the password changed confirmation email.
 */
export function passwordChangedTemplate({
    userName,
    changedAt,
    changedFromIp,
    supportUrl
}: PasswordChangedTemplateOptions): string {
    const content = [
        heading('Senha alterada com sucesso', '🔒'),

        paragraph(`Olá, <strong>${userName}</strong>!`),
        paragraph(
            'A senha da sua conta na <strong>Astra</strong> foi alterada com sucesso. ' +
                'A partir de agora, utilize a nova senha para acessar sua conta.'
        ),

        divider(),

        // Change details block
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
            style="margin:0 0 24px;background-color:#16161f;border:1px solid #2a2a3d;border-radius:10px;">
            <tr>
                <td style="padding:20px 24px;">
                    <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#3d3d52;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
                        Detalhes da alteração
                    </p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td style="padding:6px 0;border-bottom:1px solid #1e1e2e;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td style="width:40%;font-size:12px;color:#6b6b85;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">Data e hora</td>
                                        <td style="font-size:13px;color:#e8e8f0;font-weight:600;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${changedAt}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        ${
                            changedFromIp
                                ? `
                        <tr>
                            <td style="padding:6px 0;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td style="width:40%;font-size:12px;color:#6b6b85;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">Endereço IP</td>
                                        <td style="font-size:13px;color:#e8e8f0;font-weight:600;font-family:'Courier New',Courier,monospace;">${changedFromIp}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>`
                                : ''
                        }
                    </table>
                </td>
            </tr>
        </table>`,

        noticeBox(
            'Por segurança, todas as sessões ativas foram encerradas. ' +
                'Você precisará fazer login novamente em todos os seus dispositivos.',
            'info'
        ),

        divider(),

        paragraph(
            '<strong style="color:#e8e8f0;">Não foi você?</strong> Se você não realizou esta alteração, ' +
                'sua conta pode estar comprometida. Entre em contato com nosso suporte imediatamente.'
        ),

        supportUrl ? ctaButton('Contatar suporte', supportUrl) : '',

        paragraph(
            'Recomendamos que você também verifique se seu e-mail e outros serviços vinculados ' +
                'estão com senhas seguras.',
            true
        )
    ].join('');

    return baseTemplate({
        title: 'Senha alterada — Astra',
        content,
        footerNote: 'Este é um e-mail de segurança automático. Não responda a esta mensagem.'
    });
}
