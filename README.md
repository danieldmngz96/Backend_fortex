# API REST con Express y MySQL

Este proyecto es una API REST desarrollada con Express y MySQL. Está diseñada para manejar autenticación de usuarios y operaciones CRUD sobre "tipos" y "propiedades".

## Tecnologías Utilizadas

- Node.js
- Express
- MySQL
- JWT para autenticación
- Bcrypt para hashing de contraseñas
- CORS para manejo de acceso cruzado

## Instalación

Para instalar y ejecutar este proyecto localmente, sigue los siguientes pasos:

1. Clona el repositorio:
   ```bash
   git clone url-del-repositorio
   ```
2. Instala las dependencias:
   ```bash
   cd nombre-del-proyecto
   npm install
   ```
3. Configura las variables de entorno:
   - Copia el archivo `.env.example` a `.env` y ajusta las configuraciones según tu entorno local.
   - Asegúrate de que MySQL esté corriendo y que las credenciales en el archivo `.env` sean correctas.

4. Ejecuta el servidor:
   ```bash
   npm start
   ```

## Uso

Una vez que el servidor esté corriendo, podrás acceder a los endpoints definidos bajo `/api/auth` para autenticación y otros endpoints específicos para "tipos" y "propiedades".

## Contribuir

Si deseas contribuir a este proyecto, por favor considera:

- Crear un fork del repositorio.
- Crear una rama para cada característica o mejora.
- Enviar un pull request desde tu rama.

Asegúrate de seguir las guías de estilo del código y mantener la consistencia con el diseño actual.

## Licencia

Este proyecto está bajo la Licencia [INSERTE NOMBRE DE LICENCIA AQUÍ]. Puedes encontrar el texto completo de la licencia en el archivo `LICENSE` en este repositorio. 