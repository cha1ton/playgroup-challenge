README - Prueba Técnica Full Stack

### Descripción general

Aplicación Full Stack desarrollada como prueba técnica, que implementa un CRUD de productos con subida de imágenes (archivo), renderizado SSR, arquitectura modular y despliegue mediante Docker.

La solución está compuesta por:

* API Backend desarrollada en NestJS

* Frontend SSR desarrollado con Nuxt 4 (Vue 3)

* Base de datos MongoDB

* Contenedores Docker para ejecución simplificada


### Tecnologías utilizadas

Backend (API)

* Node.js
* NestJS
* MongoDB
* Mongoose
* Multer (para subir de archivos)
* TypeScript
* Arquitectura MVC (Controller / Service / Schema)
* Validación con class-validator
* CORS habilitado

Frontend (SSR)

* Nuxt 4
* Vue 3
* TypeScript
* SSR (Server Side Rendering)
* useFetch / runtimeConfig
* CSS modularizado

Infraestructura

* Docker
* Docker Compose
* Volúmenes persistentes
* MongoDB oficial (imagen Docker)

Control de versiones

* Git - GitHub


### Estructura del proyecto (resumen)

playgroup-challenge/
├── api/              # Backend NestJS
│   ├── src/
│   ├── uploads/        # Imagenes persistentes
│   └── Dockerfile
├── web/             # Frontend Nuxt SSR
│   ├── app/
│   │   ├── pages/
│   │   ├── components/
│   │   └── assets/css/
│   ├── public/
│   └── Dockerfile
├── docker-compose.yml
└── README.md


### Cómo levanta el proyecto

Requisitos previos

* Docker instalado

* Docker Compose habilitado

### Paso único para ejecutar

Desde la raiz del proyecto ejecutar:

> docker compose up --build

### Servicios disponibles

Una vez levantado:

Frontend (SSR)
http://localhost:3000

API Backend
http://localhost:3001/products

Base de datos
MongoDB ejecutándose en contenedor (puerto 27017)

### Funcionalidades disponibles

* Crear producto con imagen (archivo)

* Listar productos

* Editar producto

* Eliminar producto

* Búsqueda de productos por nombre o descripción

* Renderizado SSR en frontend

* Persistencia de datos e imágenes mediante volúmenes Docker


### Decisiones técnicas destacadas

* Uso de SSR con Nuxt para mejorar SEO y rendimiento inicial

* Subida de imágenes como archivo físico (no URL externa)

* Dockerización completa para facilitar revisión y despliegue

* Separación clara de responsabilidades (frontend / backend / DB)

* Uso de variables de entorno para entornos SSR y browser

* Eliminación automática de archivos de imagen al actualizar o eliminar productos


### El proyecto está preparado para ser evaluado ejecutando un solo comando, sin configuraciones adicionales.