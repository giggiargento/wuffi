import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { CaseType } from '@/types';
import { cn } from '@/utils/cn';

interface StatusBadgeProps {
  status: string;
  caseType?: CaseType;
}

const typeColors: Record<CaseType, string> = {
  lost: 'bg-primary',
  found: 'bg-sky',
  adoption: 'bg-mint',
  transit: 'bg-lavender',
};

export function StatusBadge({ status, caseType = 'lost' }: StatusBadgeProps) {
  const { t } = useTranslation();
  const label = t(`case.status.${status}`, { defaultValue: status });

  return (
    <View
      className={cn(
        'self-start rounded-full border-2 border-border px-3 py-1',
        typeColors[caseType]
      )}
    >
      <Text className="text-xs font-semibold text-text">{label}</Text>
    </View>
  );
}
