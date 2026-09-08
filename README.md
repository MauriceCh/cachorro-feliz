# 🐾 Cachorro Feliz - Sistema Integral de Gestión, Producción & Tienda Web

<div align="center">

**"Una marca con historia"**  
*Snacks artesanales, galletas horneadas y deshidratados 100% naturales para mascotas.*  
Fundado por el **Chef Javier Mauricio Rodríguez** junto a **Oreo** (C.E.O. de 4 patas).

[![Firebase Hosting](https://img.shields.io/badge/Deploy-Firebase%20Hosting-FFCA28?logo=firebase&logoColor=black)](https://cachorro-feliz.web.app)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Estilos-Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google Cloud](https://img.shields.io/badge/Database-Cloud%20Firestore-4285F4?logo=google-cloud&logoColor=white)](https://cloud.google.com/firestore)

🌐 **Sitio Web Oficial en Producción:** [https://cachorro-feliz.web.app](https://cachorro-feliz.web.app)  
📲 **Línea WhatsApp Oficial:** [+57 320 571 4504](https://api.whatsapp.com/send?phone=573205714504)

</div>

---

## 📖 Acerca del Proyecto

**Cachorro Feliz** es una plataforma web integral diseñada para gestionar la producción artesanal, costos, inventario, logística y ventas directas de un obrador de snacks y deshidratados naturales para perros y gatos.

El sistema unifica dos experiencias en una sola aplicación de alto rendimiento:
1. **Tienda y Catálogo Web Público**: Experiencia de compra fluida y moderna para clientes, con carrito interactivo, cálculo de tarifas de envío y generación de pedidos directos a WhatsApp.
2. **Panel de Gestión Integral del Chef (Acceso Sigiloso)**: Control total de costos por receta, cálculo de mermas de cocción/deshidratación, lotes de producción, CRM de clientes y mascotas, planificador de rutas con Google Maps y automatización de marketing con Agentes de Inteligencia Artificial (Google Gemini).

---

## 🚀 Módulos y Funcionalidades

### 1. 🛒 Catálogo Público y Pedidos a WhatsApp
* **Catálogo interactivo** filtrable por categorías: *Galletas horneadas*, *Deshidratados de res y pollo*, y *Snacks funcionales*.
* **Tarifario de envíos integrado**:
  * Zonas de Bogotá (Norte, Centro, Chapinero, Occidente, Sur).
  * Envíos nacionales por transportadora.
  * Opción de recogida en taller sin costo.
* **Generación de pedidos a WhatsApp**: Al confirmar el pedido, el sistema estructura un mensaje completo con el desglose de productos, datos del cliente, dirección, método de pago (Daviplata, Nequi, Bancolombia, Contraentrega) y datos de la mascota homenajeada.

### 2. 🍗 Producción Artesanal, Lotes y Mermas
* **Control de mermas y rendimientos**: Registra el peso crudo vs. peso final post-cocción o deshidratación para calcular el rendimiento real y el costo por gramo neto.
* **Calculadora de recetas y costos fijos**: Prorratea insumos, empaques y costos fijos mensuales en cada lote producido.
* **Trazabilidad de lotes**: Historial de lotes con fecha, unidades empacadas por presentación (100g, 250g, 500g) y notas de cocción.

### 3. 📦 Inventarios & Fijación Dinámica de Precios
* **Materias primas**: Control de stock bruto y neto utilizable, con alertas de stock mínimo y cálculo de costo promedio ponderado.
* **Producto terminado**: Visualización de existencias en bolsas y **herramienta para fijar precios de venta al público**, calculando en tiempo real el margen de rentabilidad (%) y la ganancia neta estimada por presentación.
* **Ajustes de inventario**: Registro de mermas, degustaciones o roturas con trazabilidad financiera.

### 4. 🗺️ Planificador de Rutas de Entrega
* Agrupación automática de pedidos pendientes por zona de despacho.
* **Integración con Google Maps**: Apertura de la ruta optimizada punto a punto en un solo clic.
* **Formato listo para apps de mensajería (Picap / Yango)**: Copia al portapapeles todos los datos del destinatario listos para cotizar o solicitar el servicio de entrega.

### 5. 👥 CRM de Clientes y Ficha de Mascotas
* Directorio completo de clientes con historial de compras acumulado y opciones de edición/eliminación.
* **Ficha de mascotas**: Nombre, raza, peso, requerimientos nutricionales y fecha de cumpleaños.
* **Alertas de cumpleaños**: Identifica automáticamente las mascotas cumpleañeras del mes y redacta mensajes de felicitación con obsequio para WhatsApp.
* **Recordatorio de recompra**: Mensajes personalizados para fidelización de clientes habituales.

### 6. 🤖 Agentes de Inteligencia Artificial (Google Gemini)
* **Agente de Contenido para Instagram**: Planificador semanal con estrategia temática de 7 días (*Lunes de Salud*, *Martes del CEO Oreo*, *Miércoles de Deshidratados*, etc.), generando copys persuasivos y hashtags optimizados.
* **Diseñador de Etiquetas y Stickers**: Generación de etiquetas imprimibles con lote, fecha de vencimiento e información nutricional.
* **Asistente Chef Virtual**: Soporte con IA para redacción, balance de recetas y atención al cliente.

### 7. 🔒 Modo Sigiloso de Acceso Administrativo & Sincronización Nube
* **Diseño 100% limpio para el público**: Cero botones de login visibles en la tienda pública.
* **Atajos secretos del Chef Javier**:
  * Acceso directo mediante URL: `https://cachorro-feliz.web.app/#admin`
  * Triple toque/clic consecutivo en el logo superior.
* **PIN de seguridad sincronizado en la nube**: El PIN se guarda en Cloud Firestore (`systemSettings/security`), permitiendo cambiar la clave desde el PC y que funcione automáticamente en tablet y celular.
* **Arquitectura Offline-First**: Almacenamiento local ultrarrápido con respaldo y sincronización en segundo plano con Google Cloud Firestore.

---

## 🛠️ Tecnologías

| Componente | Tecnología |
|---|---|
| **Lenguaje** | [TypeScript](https://www.typescriptlang.org/) (Strict Mode) |
| **Librería UI** | [React 18](https://react.dev/) |
| **Bundler / Servidor** | [Vite 6](https://vitejs.dev/) |
| **Estilos** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Iconografía** | [Lucide React](https://lucide.dev/) |
| **Base de Datos** | [Google Cloud Firestore](https://firebase.google.com/docs/firestore) |
| **Hosting & CDN** | [Firebase Hosting](https://firebase.google.com/docs/hosting) |
| **IA Generativa** | [Google Gemini API (@google/genai)](https://ai.google.dev/) |

---

## 💻 Instalación y Ejecución Local

### Prerrequisitos
* [Node.js](https://nodejs.org/) v18.0.0 o superior
* [Git](https://git-scm.com/)

### 1. Clonar el Repositorio
```bash
git clone https://github.com/TU_USUARIO/cachorro-feliz.git
cd cachorro-feliz
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Variables de Entorno (Opcional para IA)
Copia el archivo de ejemplo y configura tu clave de API si deseas habilitar funciones adicionales de IA:
```bash
cp .env.example .env
```

### 4. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173` (o `http://localhost:3000`).

### 5. Compilar para Producción
```bash
npm run build
```

---

## 🚀 Despliegue en Google Firebase

El proyecto ya está configurado con Firebase CLI y reglas de seguridad de Firestore optimizadas.

Para desplegar una nueva versión a internet:
```bash
npx firebase deploy --only hosting,firestore
```

---

## 📁 Estructura del Proyecto

```text
cachorro-feliz/
├── public/                 # Recursos estáticos y branding oficial
│   └── brand/              # Logotipos de Oreo, Galletas y Deshidratados
├── src/
│   ├── components/         # Vistas y componentes modulares
│   │   ├── AdminPinModal.tsx            # Modal de acceso administrativo con PIN
│   │   ├── BrandLogoEmblem.tsx          # Emblema oficial multi-variante
│   │   ├── ChangePinModal.tsx           # Cambio de PIN multi-dispositivo
│   │   ├── ClientsPetsView.tsx          # Directorio CRM y fichas de mascotas
│   │   ├── DashboardView.tsx            # Métricas financieras y KPIs
│   │   ├── DatabaseResetModal.tsx       # Herramienta de reseteo seguro de BD
│   │   ├── DeliveryRoutePlannerView.tsx # Rutas de despacho y Google Maps
│   │   ├── FinancesView.tsx             # P&L, costos fijos y rentabilidad
│   │   ├── InstagramMediaGenerator.tsx  # Generador de contenido para redes
│   │   ├── InventoryView.tsx            # Inventario, materias primas y precios
│   │   ├── Navbar.tsx                   # Barra de navegación principal
│   │   ├── ProductionView.tsx           # Lotes, recetas y control de mermas
│   │   ├── PublicStoreView.tsx          # Tienda y catálogo público para clientes
│   │   ├── PurchasesView.tsx            # Registro de compras a proveedores
│   │   └── SalesView.tsx                # Registro y control de pedidos
│   ├── lib/
│   │   ├── dbService.ts    # Motor de persistencia híbrida (Local + Firestore)
│   │   └── firebase.ts     # Configuración y conexión de Firebase
│   ├── initialData.ts      # Datos maestros y catálogo base de productos
│   ├── types.ts            # Definiciones de TypeScript
│   ├── App.tsx             # Componente raíz y orquestador de estado
│   └── main.tsx            # Punto de entrada de la aplicación
├── firebase.json           # Configuración de Firebase Hosting y Firestore
├── firestore.rules         # Reglas de seguridad de Firestore
├── package.json            # Dependencias y scripts del proyecto
├── tsconfig.json           # Configuración de TypeScript
└── vite.config.ts          # Configuración de Vite
```

---

## 👨‍🍳 Créditos & Autoría

* **Chef Javier Mauricio Rodríguez** — Fundador, formulador artesanal y maestro pastelero canino.
* **Oreo** — C.E.O., catador oficial e inspiración de la marca.
* **Bogotá, Colombia** 🇨🇴

---

<div align="center">
  <sub>Hecho con amor y dedicación para consentir a los peludos de cuatro patas. 🐶🍪</sub>
</div>
