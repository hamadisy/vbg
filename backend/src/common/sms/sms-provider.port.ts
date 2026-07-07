export const SMS_PROVIDER = Symbol('SMS_PROVIDER');

export interface SendSmsInput {
  to: string;
  body: string;
}

export interface ISmsProvider {
  send(input: SendSmsInput): Promise<void>;
}
