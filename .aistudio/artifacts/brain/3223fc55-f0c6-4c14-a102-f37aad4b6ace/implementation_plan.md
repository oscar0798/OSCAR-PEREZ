# Plataforma de Inducción SENA: Portal de Acceso Diferenciado y Control de Roles

Sistema institucional de inducción del aprendiz SENA bajo el Acuerdo 009 de 2024 (reforma Acuerdo 002 de 2026), con landing page de selección de roles, autenticación por clave para instructores (`CSF2026`), formulario de caracterización para aprendices sin clave, y sincronización automática continua con Google Drive.

---

## 1. Landing Page de Selección de Rol (`RoleSelectionLanding.tsx`)

Al ingresar a la plataforma, el usuario es recibido por una pantalla de bienvenida institucional con dos tarjetas independientes de acceso para evitar que los roles se confundan:

### A. Portal del Instructor (Gestión, Google Drive y Monitoreo)
- **Seguridad**: Requiere ingresar la clave institucional autorizada: **`CSF2026`**.
- **Funcionalidades protegidas**:
  - Vinculación y gestión de la hoja de cálculo en Google Drive (`SENA - Registro Oficial de Inducción de Aprendices`).
  - Panel de control con métricas en tiempo real de todas las fichas de formación.
  - Tabla de seguimiento con avance de módulos, nota de evaluación final y código de certificado emitido.
  - Generador de enlaces para compartir la inducción a los aprendices por WhatsApp o correo.
  - Exportación de reportes consolidados en CSV.

### B. Portal del Aprendiz (Ruta de Inducción Formativa)
- **Acceso Directo**: **Sin clave de acceso**.
- **Formulario Obligatorio de Caracterización**:
  - Nombres y Apellidos completos.
  - Tipo y Número de Documento (`CC`, `TI`, `CE`, `PPT`).
  - Ficha de caracterización (precargada automáticamente si el enlace contiene `?ficha=...`).
  - Programa de formación (precargado automáticamente si el enlace contiene `?programa=...`).
  - Regional SENA y Centro de Formación.
- **Entorno formativo aislado**:
  - Módulos 1 a 5 del Reglamento del Aprendiz.
  - Simulador de Casos del Comité de Evaluación.
  - Examen final y Certificado Oficial con código verificable.
  - Autoguardado transparente en la hoja de cálculo del instructor sin requerir credenciales ni mostrar botones de Google Drive.

---

## 2. Flujo de Navegación y Salida

- Tanto en el encabezado institucional como en el pie de página y en el panel de control se incluye el botón **"Cambiar Rol / Salir"**.
- Al pulsarlo, el usuario regresa inmediatamente al portal principal de bienvenida para alternar de perfil de manera segura.
