/**
 * @file _base.ts
 * @description Base HTML layout for all Astra transactional emails.
 * Uses table-based layout for maximum email client compatibility.
 * Inline styles only — no external CSS, no web fonts via link tags (Gmail strips them).
 *
 * @author Lucas
 * @license MIT
 */

export interface BaseTemplateOptions {
    /** Page title shown in email client tab */
    title: string;
    /** Main content block (pre-built HTML string) */
    content: string;
    /** Optional footer note below the default footer */
    footerNote?: string;
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const colors = {
    bg: '#0a0a0f',
    surface: '#111118',
    surfaceAlt: '#16161f',
    border: '#1e1e2e',
    borderLight: '#2a2a3d',
    accent: '#7c6af7',
    accentDim: '#5b52c4',
    textPrimary: '#e8e8f0',
    textMuted: '#6b6b85',
    textFaint: '#3d3d52'
};

// ─── Base wrapper ─────────────────────────────────────────────────────────────

/**
 * Wraps any email content in the shared Astra shell.
 */
export function baseTemplate({ title, content, footerNote }: BaseTemplateOptions): string {
    return `<!DOCTYPE html>
<html lang="pt-BR" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="color-scheme" content="dark" />
    <meta name="supported-color-schemes" content="dark" />
    <title>${title}</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${colors.bg};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

    <!-- Outer wrapper -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
        style="background-color:${colors.bg};min-height:100vh;">
        <tr>
            <td align="center" style="padding:48px 16px;">

                <!-- Email card -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="max-width:560px;width:100%;">

                    <!-- Logo header -->
                    <tr>
                        <td align="center" style="padding-bottom:32px;">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="background-color:${colors.surface};border:1px solid ${colors.border};border-radius:12px;padding:12px 24px;">
                                        <span style="font-size:18px;font-weight:700;letter-spacing:0.12em;color:${colors.textPrimary};text-transform:uppercase;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
                                            &#9733;&nbsp;&nbsp;ASTRA
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Main card -->
                    <tr>
                        <td style="background-color:${colors.surface};border:1px solid ${colors.border};border-radius:16px;overflow:hidden;">

                            <!-- Accent bar -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="height:3px;background:linear-gradient(90deg,${colors.accentDim} 0%,${colors.accent} 50%,${colors.accentDim} 100%);font-size:0;line-height:0;">&nbsp;</td>
                                </tr>
                            </table>

                            <!-- Content area -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding:40px 40px 32px;">
                                        ${content}
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding-top:28px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" style="border-top:1px solid ${colors.border};padding-top:24px;">
                                        <p style="margin:0 0 6px;font-size:12px;color:${colors.textFaint};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;letter-spacing:0.02em;">
                                            Este e-mail foi enviado pela plataforma <strong style="color:${colors.textMuted};">Astra</strong>.
                                        </p>
                                        <p style="margin:0;font-size:11px;color:${colors.textFaint};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
                                            Se você não solicitou este e-mail, ignore-o com segurança.
                                        </p>
                                        ${footerNote ? `<p style="margin:10px 0 0;font-size:11px;color:${colors.textFaint};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${footerNote}</p>` : ''}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
                <!-- /Email card -->

            </td>
        </tr>
    </table>
    <!-- /Outer wrapper -->

</body>
</html>`;
}

// ─── Shared building blocks ───────────────────────────────────────────────────

/**
 * Renders a large section heading with an optional icon.
 */
export function heading(text: string, icon?: string): string {
    return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
        style="margin-bottom:24px;">
        <tr>
            <td>
                ${icon ? `<p style="margin:0 0 12px;font-size:28px;line-height:1;">${icon}</p>` : ''}
                <h1 style="margin:0;font-size:22px;font-weight:700;color:${colors.textPrimary};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;letter-spacing:-0.02em;line-height:1.3;">
                    ${text}
                </h1>
            </td>
        </tr>
    </table>`;
}

/**
 * Renders a paragraph of body text.
 */
export function paragraph(text: string, muted = false): string {
    const color = muted ? colors.textMuted : colors.textPrimary;

    return `<p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:${color};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${text}</p>`;
}

/**
 * Renders a horizontal divider.
 */
export function divider(): string {
    return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
        style="margin:24px 0;">
        <tr>
            <td style="height:1px;background-color:${colors.border};font-size:0;line-height:0;">&nbsp;</td>
        </tr>
    </table>`;
}

/**
 * Renders the primary CTA button.
 */
export function ctaButton(label: string, href: string): string {
    return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"
        style="margin:28px 0;">
        <tr>
            <td style="border-radius:8px;background-color:${colors.accent};">
                <!--[if mso]>
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml"
                    href="${href}"
                    style="height:48px;v-text-anchor:middle;width:220px;"
                    arcsize="17%"
                    fillcolor="${colors.accent}"
                    strokecolor="${colors.accent}">
                    <w:anchorlock/>
                    <center style="color:#ffffff;font-family:sans-serif;font-size:14px;font-weight:700;">
                        ${label}
                    </center>
                </v:roundrect>
                <![endif]-->
                <!--[if !mso]><!-->
                <a href="${href}" target="_blank"
                    style="display:inline-block;padding:14px 32px;background-color:${colors.accent};color:#ffffff;font-size:14px;font-weight:700;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;text-decoration:none;border-radius:8px;letter-spacing:0.03em;">
                    ${label}
                </a>
                <!--<![endif]-->
            </td>
        </tr>
    </table>`;
}

/**
 * Renders a code/token display block.
 */
export function codeBlock(code: string): string {
    return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
        style="margin:24px 0;">
        <tr>
            <td align="center" style="background-color:${colors.surfaceAlt};border:1px solid ${colors.borderLight};border-radius:10px;padding:20px;">
                <span style="font-size:28px;font-weight:700;letter-spacing:0.25em;color:${colors.textPrimary};font-family:'Courier New',Courier,monospace;">
                    ${code}
                </span>
            </td>
        </tr>
    </table>`;
}

/**
 * Renders an info/warning notice box.
 */
export function noticeBox(text: string, variant: 'info' | 'warning' = 'info'): string {
    const borderColor = variant === 'warning' ? '#c4843a' : colors.borderLight;
    const iconColor = variant === 'warning' ? '#e09550' : colors.accent;
    const icon = variant === 'warning' ? '⚠' : 'ℹ';

    return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
        style="margin:16px 0;">
        <tr>
            <td style="background-color:${colors.surfaceAlt};border:1px solid ${borderColor};border-left:3px solid ${iconColor};border-radius:8px;padding:14px 16px;">
                <p style="margin:0;font-size:13px;line-height:1.6;color:${colors.textMuted};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
                    <span style="color:${iconColor};">${icon}&nbsp;</span>${text}
                </p>
            </td>
        </tr>
    </table>`;
}

/**
 * Renders a URL fallback line (for when the button doesn't work).
 */
export function urlFallback(href: string): string {
    return `
    <p style="margin:0;font-size:12px;color:${colors.textFaint};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;word-break:break-all;">
        Ou acesse diretamente:
        <a href="${href}" style="color:${colors.accent};text-decoration:none;">${href}</a>
    </p>`;
}
