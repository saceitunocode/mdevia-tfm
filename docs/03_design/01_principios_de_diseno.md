# 03a — Principios de Diseño

> **Propósito:** Sistema visual y responsive real del proyecto.
> **Última actualización:** Febrero 2026.
> **Fuente de verdad:** código actual del repositorio.

---

## Sistema de estilos

- **Framework CSS:** Tailwind CSS v4 (configuración CSS-first).
- **Tipografía:** Inter (Google Fonts).
- **Iconografía:** Lucide React.
- **Animaciones:** Framer Motion (transiciones de página, micro-animaciones).
- **Notificaciones:** Sonner (toasts).
- **Temas:** next-themes (soporte dark/light mode).

---

## Paleta de colores

- Colores definidos como variables CSS en `globals.css`.
- Esquema a eleccion para el backoffice. (dark/light mode)
- Esquema a eleccion para el escaparate público. (dark/light mode)
- Acento principal: verde (identidad de marca inmobiliaria).

---

## Responsive design

- **Mobile-first:** todos los layouts se diseñan primero para móvil.
- **Breakpoints:** los de Tailwind CSS v4 por defecto.
- Backoffice: sidebar colapsable en móvil, botones de acción a ancho completo.
- Escaparate: grid adaptativo (1 columna móvil → 2 columnas tablet → 3 columnas desktop).

---

## Componentes clave

### Tablas de datos
- Tablas responsivas sin scroll horizontal en móvil.
- Acciones por fila (editar, ver detalle).
- Estados vacíos con mensaje descriptivo.
- Estados de carga con skeletons.

### Formularios
- `react-hook-form` + `zod` para validación.
- Feedback de error por notificaciones toast.
- Botones de submit con estado de carga.
- Dialogs/modales para creación rápida.

### Galería de imágenes (PropertyGalleryManager)
- **Desktop:** botones de acción visibles al hacer hover sobre cada imagen.
- **Mobile:** modo selección táctil — toque para seleccionar, luego aparecen acciones.
- Drag-and-drop para reordenar (dnd-kit con `TouchSensor` y retardo de 300ms para diferenciar scroll de arrastre).
- Indicador visual de imagen de portada (estrella).
- Fondos sólidos en botones de acción para legibilidad sobre cualquier fotografía.

### Calendario
- Vistas: mes, semana, día y agenda.
- Navegación por URL params.
- Colores por tipo de evento: VISIT (azul), NOTE (amarillo), CAPTATION (naranja), REMINDER (verde).
- Dialogs para crear y editar eventos.

### Escaparate público
- Tarjetas de propiedad con imagen de portada, precio, características y badge de operación.
- Filtros laterales (desktop) / panel deslizante (móvil).
- Botón de filtros translúcido en móvil.
- Scroll suave al cambiar de página o criterio de ordenación.
- Header con menú overlay en móvil.

---

## Patrones de UX

- **Skeleton loading:** componentes de carga para tablas, tarjetas y calendario.
- **Toast notifications:** feedback de acciones (éxito, error) con Sonner.
- **Optimistic UI:** actualización inmediata de la interfaz antes de confirmación del servidor.
- **Stale-while-revalidate:** datos del JWT mostrados inmediatamente, actualizados desde `/users/me`.
