import { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { CaseCard } from '@/components';
import { useExploreCases } from '@/hooks/useCases';
import { getCurrentLocation, DEFAULT_LOCATION } from '@/utils/location';
import { CASE_TYPE_COLORS } from '@/constants';

export default function ExploreMapScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: cases, isLoading } = useExploreCases();
  const [region, setRegion] = useState<Region>({
    ...DEFAULT_LOCATION,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  });
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    getCurrentLocation().then((loc) => {
      if (loc) {
        setRegion({
          latitude: loc.latitude,
          longitude: loc.longitude,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        });
      }
    });
  }, []);

  const selectedCases = cases ?? [];

  return (
    <>
      <Stack.Screen
        options={{
          title: t('map.title'),
          headerStyle: { backgroundColor: '#FFF4EA' },
        }}
      />
      <View className="flex-1 bg-background">
        {isLoading ? (
          <ActivityIndicator color="#F9A23B" className="absolute z-10 self-center top-1/2" />
        ) : null}
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation
          showsMyLocationButton
        >
          {selectedCases.map((c) => (
            <Marker
              key={c.id}
              coordinate={c.location}
              pinColor={CASE_TYPE_COLORS[c.caseType]}
              title={c.title}
              description={c.petSnapshot.name}
              onCalloutPress={() => router.push(`/case/${c.id}`)}
            />
          ))}
        </MapView>

        {selectedCases.length > 0 ? (
          <View className="absolute bottom-4 left-0 right-0 px-4">
            <CaseCard
              caseItem={selectedCases[0]}
              onPress={() => router.push(`/case/${selectedCases[0].id}`)}
            />
          </View>
        ) : (
          <View className="absolute bottom-8 self-center rounded-full border-2 border-border bg-card px-4 py-2">
            <Text className="text-sm text-muted">{t('explore.empty')}</Text>
          </View>
        )}
      </View>
    </>
  );
}
