import type { Case } from '@/types';

const CLOSED_STATUSES = new Set(['closed', 'reunited', 'adopted', 'placed']);

export function isActiveCase(caseItem: Case): boolean {
  return !CLOSED_STATUSES.has(caseItem.status);
}

export function countActiveCasesForPet(cases: Case[], petId: string): number {
  return cases.filter((c) => c.petId === petId && isActiveCase(c)).length;
}
