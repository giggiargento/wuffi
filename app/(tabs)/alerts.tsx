import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components';

export default function AlertsScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <EmptyState
        title={t('alerts.empty')}
        subtitle={t('alerts.emptySubtitle')}
        icon="notifications-outline"
      />
    </SafeAreaView>
  );
}
