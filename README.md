# Smartnest
Url productiva:

smartnest-xi.vercel.app


## Requisitos
- Node.js (versión 20.18.1 o superior)
- npm (versión 10.8.2 o superior)

## Instalación
1. Clona el repositorio:
   ```bash
   git clone https://github.com/cesarlq/smartnest
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd smartnest
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```

## Scripts
- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Construye la aplicación para producción.
- `npm run start`: Inicia la aplicación en modo producción.
- `npm run lint`: Ejecuta el linter para verificar el código.
- `npm run server`: Ejecuta el servidor
## Cómo correr el proyecto

### Configuración previa
1. Asegúrate de tener un archivo `.env.local` en la raíz del proyecto con la siguiente configuración:
   ```
   MONGODB_URI
   PORT=3003
   ```

### Ejecutar el servidor backend
1. Inicia el servidor Express:
   ```bash
   npm run server
   ```
   El servidor se ejecutará en `http://localhost:3003`

### Ejecutar el cliente/frontend
1. En otra terminal, inicia el servidor de desarrollo de Next.js:
   ```bash
   npm run dev
   ```
2. Abre tu navegador y navega a `http://localhost:3000`

### Ejecutar ambos simultáneamente
Si deseas ejecutar tanto el servidor como el cliente en una sola terminal, puedes usar:
```bash
npm run server & npm run dev
```


## Dependencias
- @emotion/react: ^11.14.0
- @emotion/styled: ^11.14.0
- @fortawesome/fontawesome-svg-core: ^6.7.2
- @fortawesome/free-solid-svg-icons: ^6.7.2
- @fortawesome/react-fontawesome: ^0.2.2
- @mui/material: ^7.0.1
- @reduxjs/toolkit: ^2.6.1
- bcryptjs: ^3.0.2
- body-parser: ^2.2.0
- cors: ^2.8.5
- express: ^4.21.2
- jsonwebtoken: ^9.0.2
- mongodb: ^6.15.0
- next: 15.2.4
- react: ^17.0.0 || ^18.0.0 || ^19.0.0
- react-dom: ^17.0.0 || ^18.0.0 || ^19.0.0
- react-redux: ^9.2.0

## DevDependencias
- @eslint/eslintrc: ^3
- @tailwindcss/postcss: ^4
- @types/bcryptjs: ^2.4.6
- @types/body-parser: ^1.19.5
- @types/cors: ^2.8.17
- @types/express: ^5.0.1
- @types/jsonwebtoken: ^9.0.9
- @types/node: ^20
- @types/react: ^19
- @types/react-dom: ^19
- eslint: ^9
- eslint-config-next: 15.2.4
- tailwindcss: ^4
- typescript: ^5

