# WUFFI

Aplicación móvil para registro personal de mascotas y exploración pública de casos (perdidas, encontradas, adopción y tránsito).

## Stack

- Expo 53 + React Native + TypeScript
- Expo Router
- Firebase Auth, Firestore, Storage
- NativeWind, React Query, Zustand, Zod
- i18n (es-AR default, en-US)

## Setup

1. Instalar dependencias:

```bash
npm install
```

2. Copiar variables de entorno:

```bash
cp .env.example .env
```

3. Completar credenciales Firebase y Google Maps en `.env`:

```
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=
```

4. Desplegar reglas Firebase (requiere Firebase CLI autenticado):

```bash
npx -y firebase-tools@latest deploy --only firestore:rules,firestore:indexes,storage
```

5. Iniciar la app:

```bash
npm start
```

## Estructura

- `app/` — Rutas Expo Router (auth, tabs, pet, case, create, explore)
- `src/components/` — Design system
- `src/services/` — Capa Firebase
- `src/hooks/` — React Query hooks
- `src/i18n/locales/` — Traducciones es-AR / en-US
- `firebase/` — Reglas e índices Firestore/Storage

## MVP incluido

- Autenticación email/contraseña
- Home con mascotas y acciones rápidas
- CRUD mascotas personales
- Publicación de casos: lost, found, adoption, transit
- Explorar con filtros, lista y mapa
- Favoritos y perfil de usuario
- Ubicación Argentina: provincia, ciudad, barrio

## Documentación

Ver [docs/WUFFI-ARCHITECTURE-ROADMAP.md](docs/WUFFI-ARCHITECTURE-ROADMAP.md)
