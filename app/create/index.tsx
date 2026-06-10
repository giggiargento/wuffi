import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components';

const CREATE_OPTIONS = [
  {
    key: 'personalPet',
    icon: 'paw' as const,
    route: '/create/personal/1',
    color: 'bg-lavender',
  },
  {
    key: 'lostPet',
    icon: 'alert-circle' as const,
    route: '/create/lost/1',
    color: 'bg-primary',
  },
  {
    key: 'foundPet',
    icon: 'search' as const,
    route: '/create/found/1',
    color: 'bg-sky',
  },
  {
    key: 'adoption',
    icon: 'heart' as const,
    route: '/create/adoption/1',
    color: 'bg-mint',
  },
  {
    key: 'transit',
    icon: 'car' as const,
    route: '/create/transit/1',
    color: 'bg-lavender',
  },
];

export default function CreateIndexScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: t('create.title'),
          headerStyle: { backgroundColor: '#FFF4EA' },
        }}
      />
      <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
        <ScrollView className="flex-1 px-4 py-4" contentContainerClassName="pb-8">
          <Text className="mb-6 text-center text-lg text-muted">{t('create.title')}</Text>
          {CREATE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.key}
              onPress={() => router.push(option.route as never)}
              activeOpacity={0.85}
            >
              <Card className={`mb-4 flex-row items-center ${option.color}`}>
                <View className="mr-4 rounded-2xl border-2 border-border bg-card p-3">
                  <Ionicons name={option.icon} size={28} color="#1F2937" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-text">
                    {t(`create.${option.key}`)}
                  </Text>
                  <Text className="mt-1 text-sm text-muted">
                    {t(`create.${option.key}Desc`)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#6B7280" />
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
