# WUFFI — Configuración Firebase

Guía paso a paso para conectar Firebase real (sin mock auth).

## 1. Iniciar sesión en Firebase CLI

```bash
npx -y firebase-tools@latest login
```

## 2. Crear o seleccionar proyecto

**Opción A — Crear proyecto nuevo:**

```bash
npx -y firebase-tools@latest projects:create wuffi-app-ar --display-name "WUFFI"
npx -y firebase-tools@latest use wuffi-app-ar
```

**Opción B — Proyecto existente:**

```bash
npx -y firebase-tools@latest use TU_PROJECT_ID
```

Actualizá `.firebaserc` con el mismo `project_id`.

## 3. Registrar app Web en Firebase

```bash
npx -y firebase-tools@latest apps:create WEB "WUFFI Web" --project wuffi-app-ar
```

## 4. Obtener credenciales (SDK config)

```bash
npx -y firebase-tools@latest apps:sdkconfig WEB --project wuffi-app-ar
```

Copiá la salida JSON al archivo `.env`:

| Firebase SDK field | Variable `.env` |
|---|---|
| `apiKey` | `EXPO_PUBLIC_FIREBASE_API_KEY` |
| `authDomain` | `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `EXPO_PUBLIC_FIREBASE_PROJECT_ID` |
| `storageBucket` | `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `EXPO_PUBLIC_FIREBASE_APP_ID` |

```bash
cp .env.example .env
# Editá .env con los valores
```

## 5. Habilitar servicios en Firebase Console

### Authentication → Email/Password
1. [Authentication](https://console.firebase.google.com/) → Sign-in method
2. Activar **Correo electrónico/Contraseña**

### Google (opcional, preparado)
Ya está en `firebase.json`. Después de deploy:
- Verificar que `localhost` esté en **Authorized domains**

### Firestore
```bash
npx -y firebase-tools@latest init firestore --project wuffi-app-ar
```
Región recomendada: **southamerica-east1** (São Paulo, cercana a Argentina).

### Storage
Se habilita al desplegar reglas por primera vez.

## 6. Desplegar reglas e índices

```bash
npx -y firebase-tools@latest deploy --only auth,firestore,storage --project wuffi-app-ar
```

## 7. Arrancar la app

```bash
npm start
# Web: w
# Expo Go: escanear QR
```

**Importante:** reiniciá Expo después de crear/editar `.env`.

## 8. Probar auth

1. Registro con email + contraseña
2. Logout desde Perfil
3. Login con las mismas credenciales

Verificá en Firebase Console → Authentication → Users.

## Apps nativas (Android/iOS)

Para builds nativos, registrá también:

```bash
npx -y firebase-tools@latest apps:create ANDROID --package-name com.wuffi.app --project wuffi-app-ar
npx -y firebase-tools@latest apps:create IOS --bundle-id com.wuffi.app --project wuffi-app-ar
npx -y firebase-tools@latest apps:sdkconfig ANDROID --project wuffi-app-ar > google-services.json
npx -y firebase-tools@latest apps:sdkconfig IOS --project wuffi-app-ar > GoogleService-Info.plist
```

Estos archivos están en `.gitignore`.

## Troubleshooting

| Error | Solución |
|---|---|
| `Firebase not configured` | Crear `.env` y reiniciar Expo |
| `auth/operation-not-allowed` | Habilitar Email/Password en Console |
| `Missing or insufficient permissions` | `firebase deploy --only firestore,storage` |
| `auth/unauthorized-domain` (web) | Agregar `localhost` en Authorized domains |
