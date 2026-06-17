# AutoCare — Gestión de vehículos

Aplicación móvil para administrar vehículos, mantenimientos, gastos y recordatorios. Desarrollada con **Ionic 8**, **Angular 20** y **Capacitor 8** para despliegue en navegador y Android.

---

## Descripción

**AutoCare** permite a cada usuario:

- Registrarse e iniciar sesión (datos guardados en `localStorage`)
- Gestionar uno o más vehículos
- Registrar mantenimientos y gastos asociados
- Crear recordatorios de servicio
- Ver estadísticas con gráficos (Chart.js)
- Consultar un dashboard con resumen del vehículo principal

No requiere backend ni variables de entorno: toda la persistencia es local en el dispositivo/navegador.

---

## Tecnologías

| Tecnología | Versión |
|---|---|
| Angular | 20.x |
| Ionic | 8.x |
| Capacitor | 8.x |
| TypeScript | 5.9.x |
| Chart.js | 4.x |
| Font Awesome | 7.x |

---

## Estructura del proyecto

```
AutoCarDev/
├── .github/workflows/    # CI con GitHub Actions
├── android/              # Proyecto nativo Android (Capacitor)
├── src/
│   ├── app/
│   │   ├── components/   # Formularios reutilizables
│   │   ├── guards/       # Protección de rutas (authGuard)
│   │   ├── pages/          # Pantallas de la app
│   │   └── services/       # auth, storage, recordatorio
│   ├── assets/
│   ├── environments/
│   └── theme/
├── .nvmrc
├── LICENSE
├── angular.json
├── capacitor.config.ts
├── ionic.config.json
├── package.json
└── tsconfig.json
```

### Rutas principales

| Ruta | Descripción | Requiere login |
|---|---|---|
| `/login` | Inicio de sesión | No |
| `/register` | Registro de usuario | No |
| `/dashboard` | Panel principal | Sí |
| `/vehiculos` | Lista y gestión de vehículos | Sí |
| `/mantenimientos` | Historial de mantenimientos | Sí |
| `/gastos` | Registro de gastos | Sí |
| `/recordatorios` | Alertas y recordatorios | Sí |
| `/estadisticas` | Gráficos y resúmenes | Sí |
| `/perfil` | Datos del usuario | Sí |

---

## Requisitos previos

| Herramienta | Versión recomendada |
|---|---|
| **Node.js** | 20 LTS (ver `.nvmrc`) |
| **npm** | 10.x o superior |
| **Git** | Cualquier versión reciente |

### Solo si vas a compilar para Android

| Herramienta | Notas |
|---|---|
| **Android Studio** | Con Android SDK instalado |
| **JDK** | Versión 17 o superior |
| **Gradle** | Se descarga automáticamente al abrir el proyecto Android |

---

## Inicio rápido (paso a paso)

### 1. Clonar el repositorio

```bash
git clone https://github.com/BOTON03/AutoCarDev.git
cd AutoCarDev
git checkout develop
```

### 2. Usar la versión correcta de Node

```bash
nvm use
```

Si no tienes `nvm`, instala Node.js 20 LTS manualmente.

### 3. Instalar dependencias

```bash
npm ci
```

> Usa `npm install` solo si no existe `package-lock.json`.

### 4. Ejecutar en el navegador

```bash
npm start
```

Abre `http://localhost:4200`. La primera pantalla es el **login**; si no tienes cuenta, usa **Registrarse**.

### 5. (Opcional) Pruebas y lint

```bash
npm test
npm run lint
```

---

## Compilar y ejecutar en Android

```bash
npm run build
npx cap sync android
npx cap open android
```

Desde Android Studio, ejecuta la app en un emulador o dispositivo con el botón **Run** (▶).

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Servidor de desarrollo (`ng serve`) |
| `npm run build` | Build de producción en `www/` |
| `npm run watch` | Build en modo watch (desarrollo) |
| `npm test` | Pruebas unitarias (Karma + Jasmine) |
| `npm run test:ci` | Pruebas en modo CI (ChromeHeadless) |
| `npm run lint` | Análisis de código con ESLint |

---

## CI/CD

El workflow `.github/workflows/ci.yml` ejecuta automáticamente en las ramas `main` y `develop`:

1. `npm ci`
2. `npm run lint`
3. `npm run build`
4. `npm run test:ci`

---

## Notas importantes

- **Datos locales:** usuarios, vehículos y registros se guardan en `localStorage`. Si limpias el caché del navegador, se pierden los datos.
- **Rama de desarrollo:** el trabajo activo está en `develop`.

---

## Flujo de uso (primera vez)

1. Abre `http://localhost:4200`
2. Ve a **Registrarse** y crea un usuario
3. Inicia sesión
4. En **Vehículos**, agrega tu primer vehículo
5. Desde el **Dashboard** verás el resumen del vehículo principal
6. Registra mantenimientos, gastos y recordatorios desde sus secciones

---

## Licencia

MIT — ver [LICENSE](LICENSE).

## Autores

Proyecto académico — Programación Móvil, Poli U.
