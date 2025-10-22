import { noticeMessageOptionsEnum } from '../enum/noticeNessageOptionsEnum';
import { TicketTypeEnum } from '../enum/ticketEnums';

// noticeMessageOptionsEnum -> backend setting name
export const MESSAGE_TO_SETTING: Record<noticeMessageOptionsEnum, string> = {
  [noticeMessageOptionsEnum.PreNotice]: 'AdvanceNoticeDaysForPayment',
  [noticeMessageOptionsEnum.PaymentNotice]: 'DebtReminderDaysForPayment',
  [noticeMessageOptionsEnum.DemandNotice]: 'DemandNoticeDaysForPayment',
  [noticeMessageOptionsEnum.Form3]: 'Form3DaysForPayment',
  [noticeMessageOptionsEnum.DebtReminder]: 'DebtReminderDaysForPayment',
};

type SettingsCategory = 'General' | 'Parking' | 'Administrative';

export interface AuthorityPaymentSetting {
  id: string;
  name: string; // e.g. "AdvanceNoticeDaysForPayment"
  value: string; // e.g. "17"
  valueType: 'Int' | 'NumArray' | string;
  settingsCategory: SettingsCategory;
}

export function parseIntOrNull(v?: string): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** חיפוש ערך לפי שם + קדימות קטגוריה */

export function pickIntSetting(
  settings: AuthorityPaymentSetting[],
  name: string,
  preferredCategory?: SettingsCategory
): number | null {
  const pool = settings.filter((s) => s.name === name && s.valueType === 'Int');

  if (preferredCategory) {
    const hit = pool.find((s) => s.settingsCategory === preferredCategory);
    if (hit) return parseIntOrNull(hit.value);
  }

  const gen = pool.find((s) => s.settingsCategory === 'General');
  if (gen) return parseIntOrNull(gen.value);

  if (pool.length) return parseIntOrNull(pool[0].value);
  return null;
}

// TicketTypeEnum: ADMIN=1 -> Administrative, PARKING=2 -> Parking, GENERAL=3 -> General
export function coerceToCategory(ticketTypeId: any): SettingsCategory {
  const n =
    typeof ticketTypeId === 'number' ? ticketTypeId : Number(ticketTypeId);
  if (n === 1) return 'Administrative';
  if (n === 2) return 'Parking';
  return 'General';
}
