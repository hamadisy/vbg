// SMS body for the "new case" notification, per recipient language. Mirrors
// the frontend's SUPPORTED_LANGUAGES (fr/en/ar) - see frontend/src/i18n/i18n.ts.
// Any other NotificationRecipient.language value (e.g. pulaar/wolof/soninke,
// listed in the spec but not yet content-translated anywhere in the app)
// falls back to French, matching the app-wide fallbackLng.
export interface NewCaseSmsParams {
  violenceType: string;
  region: string;
  caseLink: string;
}

const TEMPLATES: Record<string, (params: NewCaseSmsParams) => string> = {
  fr: ({ violenceType, region, caseLink }) =>
    `Nouveau cas VBG de ${violenceType} signalé à ${region}.\nLien du dossier : ${caseLink}`,
  en: ({ violenceType, region, caseLink }) =>
    `New VBG case of ${violenceType} reported in ${region}.\nCase Link: ${caseLink}`,
  ar: ({ violenceType, region, caseLink }) =>
    `تم الإبلاغ عن حالة عنف جديدة من نوع ${violenceType} في ${region}.\nرابط الحالة: ${caseLink}`,
};

export function renderNewCaseSms(language: string, params: NewCaseSmsParams): string {
  const template = TEMPLATES[language] ?? TEMPLATES.fr;
  return template(params);
}
