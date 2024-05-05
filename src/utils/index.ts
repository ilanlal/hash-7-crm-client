import { GoogleCredentialResponse } from '../types/google.accounts';
import { TimePeriod } from '../types/app.crm.tasks';

export const FIVE_MINUTES_IN_MS = 1000 * 60 * 5;
export const EMPTY_TIMER = '00:00:00';

export function extractClientId(
  credentialResponse: GoogleCredentialResponse,
): string | undefined {
  const clientId =
    credentialResponse?.clientId ?? credentialResponse?.client_id;
  return clientId;
};

export function parseToTimer(diff: number | null | 0): string {
  if (diff === 0) return EMPTY_TIMER;
  if (diff === null) return '🔹:🔹:🔹';
  if (diff < 0) return '🟠:🟠:🟠';

  const seconds = (Math.floor((diff % (1000 * 60)) / 1000) + "").padStart(2, '0');
  const minutes = (Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)) + "").padStart(2, '0');
  const hours = (Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + "").padStart(2, '0');


  return `${hours}:${minutes}:${seconds}`;
};

export function parseToTimerInSec(diff: number | null | 0): string {
  if (diff === 0) return EMPTY_TIMER;
  if (diff === null) return '🔹:🔹:🔹';
  if (diff < 0) return '🟠:🟠:🟠';

  const seconds = (Math.floor((diff % (1000 * 60)) / 1000) + "").padStart(2, '0');
  const minutes = (Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)) + "").padStart(2, '0');
  const hours = (Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + "").padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

export function parseToTimerInMin(diff: number | null | 0): string {
  if (diff === 0) return EMPTY_TIMER;
  if (diff === null) return '🔹:🔹:🔹';
  if (diff < 0) return '🟠:🟠:🟠';

  const seconds = (Math.floor((diff % (1000 * 60)) / 1000) + "").padStart(2, '0');
  const minutes = (Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)) + "").padStart(2, '0');

  return `${minutes}:${seconds}`;
};

export function parseToTimerInHour(diff: number | null | 0): string {
  if (diff === 0) return EMPTY_TIMER;
  if (diff === null) return '🔹:🔹:🔹';
  if (diff < 0) return '🟠:🟠:🟠';

  const minutes = (Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)) + "").padStart(2, '0');
  const hours = (Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + "").padStart(2, '0');

  return `${hours}:${minutes}`;
};

export function parseToTimerInDay(diff: number | null | 0): string {
  if (diff === 0) return EMPTY_TIMER;
  if (diff === null) return '🔹:🔹:🔹';
  if (diff < 0) return '🟠:🟠:🟠';

  const hours = (Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + "").padStart(2, '0');
  const days = (Math.floor(diff / (1000 * 60 * 60 * 24)) + "").padStart(2, '0');;

  return `${days}:${hours}`;
};

export function parseToTimerInMonth(diff: number | null | 0): string {
  if (diff === 0) return EMPTY_TIMER;
  if (diff === null) return '🔹:🔹:🔹';
  if (diff < 0) return '🟠:🟠:🟠';

  const days = (Math.floor(diff / (1000 * 60 * 60 * 24)) + "").padStart(2, '0');;
  const months = (Math.floor(diff / (1000 * 60 * 60 * 24 * 30)) + "").padStart(2, '0');

  return `${months}:${days}`;
};

export function parseToTime(timeStamp: number | null | 0): string {
  if (timeStamp === 0) return '◽:◽';
  if (timeStamp === null) return '🔹:🔹';
  if (timeStamp < 0) return '🔸:🔸';

  const date = new Date(timeStamp);
  const minutes = date.getUTCMinutes();
  const hours = date.getUTCHours();
  const seconds = date.getUTCSeconds();

  return `${hours}:${minutes}:${seconds}`;
};

export function parseToTimePeriod(date: Date | null | undefined): TimePeriod {
  if (!date) return TimePeriod.Undefined;
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  if (diff < 0) return TimePeriod.Undefined;
  if (diff < 1000 * 60 * 60 * 24) return TimePeriod.Today;
  if (diff < 1000 * 60 * 60 * 24 * 2) return TimePeriod.Tomorrow;
  if (diff < 1000 * 60 * 60 * 24 * 7) return TimePeriod.ThisWeek;
  if (diff < 1000 * 60 * 60 * 24 * 14) return TimePeriod.NextWeek;
  if (diff < 1000 * 60 * 60 * 24 * 30) return TimePeriod.ThisMonth;
  if (diff < 1000 * 60 * 60 * 24 * 60) return TimePeriod.NextMonth;
  return TimePeriod.Undefined;
};

export function guidGenerator(): string {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};