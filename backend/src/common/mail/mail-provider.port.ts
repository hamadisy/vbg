export const MAIL_PROVIDER = Symbol('MAIL_PROVIDER');

export interface SendMailInput {
  to: string;
  subject: string;
  text: string;
}

export interface IMailProvider {
  send(input: SendMailInput): Promise<void>;
}
