import type { TFunction } from 'i18next';

export const MAX_PET_AGE_YEARS = 25;
export const MAX_PET_AGE_MONTHS = MAX_PET_AGE_YEARS * 12;

export function splitAgeMonths(ageMonths: number): { years: number; months: number } {
  return {
    years: Math.floor(ageMonths / 12),
    months: ageMonths % 12,
  };
}

export function combineAgeMonths(years: number, months: number): number {
  return years * 12 + months;
}

export function monthsToAgeFields(ageMonths?: number): { years: string; months: string } {
  if (ageMonths == null || ageMonths <= 0) {
    return { years: '', months: '' };
  }
  const { years, months } = splitAgeMonths(ageMonths);
  return {
    years: years > 0 ? String(years) : '',
    months: months > 0 ? String(months) : '',
  };
}

/** Natural-language age for UI (never raw month counts). */
export function formatPetAge(t: TFunction, ageMonths?: number): string | null {
  if (ageMonths == null || ageMonths <= 0) return null;

  const { years, months } = splitAgeMonths(ageMonths);

  if (years === 0) {
    return t('pet.age.months', { count: months });
  }
  if (months === 0) {
    return t('pet.age.years', { count: years });
  }
  return t('pet.age.yearsAndMonths', {
    years: t('pet.age.years', { count: years }),
    months: t('pet.age.months', { count: months }),
  });
}
