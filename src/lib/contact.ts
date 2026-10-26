export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot - must stay empty. */
  website: string;
}

export type ContactErrorKey = "nameRequired" | "emailInvalid" | "messageShort" | "tooLong";
export type ContactErrors = Partial<Record<keyof ContactInput, ContactErrorKey>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  const name = input.name.trim();
  const message = input.message.trim();
  if (!name) errors.name = "nameRequired";
  else if (name.length > 120) errors.name = "tooLong";
  if (!EMAIL.test(input.email.trim()) || input.email.length > 200) errors.email = "emailInvalid";
  if (input.subject.length > 200) errors.subject = "tooLong";
  if (message.length < 20) errors.message = "messageShort";
  else if (message.length > 5000) errors.message = "tooLong";
  return errors;
}

/** Bots tend to fill every field; humans never see the honeypot. */
export function isLikelySpam(input: ContactInput): boolean {
  return input.website.trim().length > 0;
}
