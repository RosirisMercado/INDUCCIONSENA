# Sincronización en Tiempo Real de Respuestas de Aprendices en Google Sheets y Google Drive

Plan de arquitectura y flujo de sincronización para almacenar automáticamente en tiempo real las respuestas de la evaluación y el progreso de los módulos de los aprendices del SENA en una hoja de cálculo oficial alojada en la cuenta de Google Drive del instructor.

---

## Decisiones Críticas y Preferencias Confirmadas

> [!IMPORTANT]
> Confirmaciones previas del usuario incorporadas en este plan:
> - **Cuenta Central de Almacenamiento**: Cuenta oficial de Google Drive del instructor para centralizar todos los registros de la ficha de formación.
> - **Momento de Sincronización**: En tiempo real por cada respuesta del cuestionario y por cada módulo completado, garantizando cero pérdida de información.

- **Identidad de la Hoja Central**: Archivo nombrado `SENA Regional Atlántico - Registro y Respuestas Inducción 2026`.
- **Modo Desconectado / Resiliencia**: Cola local en memoria y `localStorage` con vaciado automático por lotes (*batch append*) tan pronto exista sesión activa.
- **Acceso Restringido**: Perfil de instructor protegido por contraseña (`sena2026`) con control exclusivo para conectar/desconectar Google Drive y abrir la hoja de cálculo.

---

## 1. Visión General del Producto y Valor

- **Qué hace**: Permite que a medida que los aprendices completan su inducción al reglamento formativo (Acuerdo 009 de 2024 y 002 de 2026), cada selección de respuesta, puntaje acumulado y módulo superado se registre instantáneamente en una fila estructurada de una hoja de cálculo de Google Sheets.
- **Público Objetivo**: 
  - **Aprendices**: Estudian los módulos y resuelven la evaluación formativa con retroalimentación inmediata y confirmación visual de sincronización.
  - **Instructores / Coordinadores**: Monitorean el desempeño global de la ficha en vivo desde su Google Drive sin necesidad de descargas manuales o consolidación externa.
- **Valor Principal**: Trazabilidad institucional inmediata, respaldo seguro en la nube de Google Workspace y cumplimiento normativo del proceso de inducción.

---

## 2. Experiencia de Usuario y Diseño Visual

### Flujos de Usuario Principales

1. **Flujo del Aprendiz (Sincronización Transparente)**:
   - Ingresa a través de "Soy Aprendiz" con su documento, nombre y ficha.
   - En la cabecera interactiva (*ApprenticeHeader*), visualiza el gráfico circular de progreso y una insignia de estado de sincronización en la nube.
   - Al marcar opciones en la evaluación o finalizar módulos, el sistema envía el registro en segundo plano. Si no hay conexión o sesión del instructor activa, se almacena en el búfer seguro local sin interrumpir su examen.

2. **Flujo del Instructor (Gestión y Consulta)**:
   - Accede a "Soy Instructor" validando la clave institucional.
   - En el panel superior encuentra la tarjeta **Sincronización en Tiempo Real con Google Drive & Google Sheets**.
   - Con un clic en el botón oficial de Google vincula su cuenta. El sistema crea o localiza la hoja oficial en su Google Drive.
   - Dispone de:
     - Indicador en vivo de estado de conexión y cuenta activa.
     - Botón directo **"Abrir Hoja en Google Drive"**.
     - Contador de registros sincronizados y vaciado manual de cola en caso de intermitencias.
     - Opción de desconexión segura con diálogo de confirmación.

### Identidad Visual y Estilo
- **Paleta Institucional SENA**: Acento verde institucional `#39A900`, verde esmeralda, slate neutro de alto contraste y fondos limpios compatibles con modo claro y oscuro.
- **Tipografía y Legibilidad**: Escala tipográfica nítida, métricas tabulares para puntajes y porcentajes.
- **Micro-interacciones y Estados**: Pulso suave en indicador de sincronización en vivo, spinners discretos durante transmisiones de red y alertas contextuales informativas.

---

## 3. Decisiones de Producto y Arquitectura

- **Decisión 1: Sincronización continua evento por evento vs. envío final**:
  - *Enfoque*: Cada selección de respuesta en la evaluación genera un registro inmediato en la hoja de cálculo con el resultado (CORRECTA/INCORRECTA) y progreso actual.
  - *Razón*: Si un aprendiz se desconecta repentinamente o cierra el navegador a mitad de evaluación, el instructor conserva el avance exacto alcanzado.
- **Decisión 2: Cola local resistente a desconexiones (Offline-First)**:
  - *Enfoque*: Registro continuo en `localStorage` sincronizado mediante el patrón *Producer-Consumer*.
  - *Razón*: Evita bloqueos de interfaz si la red se ralentiza y garantiza que los aprendices puedan trabajar aunque el instructor aún no haya iniciado sesión con Google en ese momento.
- **Decisión 3: Estructura de Datos en 12 Columnas Oficiales**:
  - *Estructura*:
    1. `Fecha y Hora`: Timestamp exacto en hora local de Colombia.
    2. `Documento`: Identificación del aprendiz.
    3. `Nombre del Aprendiz`: Nombre completo registrado.
    4. `Ficha`: Código de ficha de caracterización.
    5. `Programa de Formación`: Especialidad técnica o tecnológica.
    6. `Regional / Centro`: Regional Atlántico / Centro correspondiente.
    7. `Tipo de Registro`: `RESPUESTA_EVALUACION`, `MODULO_COMPLETADO` o `EVALUACION_FINAL`.
    8. `Módulo / Pregunta Evaluada`: Título del módulo o enunciado de la pregunta.
    9. `Respuesta Seleccionada`: Texto de la opción escogida.
    10. `Resultado`: `CORRECTA`, `INCORRECTA`, `COMPLETADO` o `APROBADO`.
    11. `Puntaje / Progreso (%)`: Porcentaje de aprobación alcanzado.
    12. `Estado General`: `Aprobado` o `Requiere Refuerzo`.

---

## 4. Arquitectura Técnica y Estrategia de Datos

### Diagrama del Sistema

```
┌────────────────────────────────────────────────────────────────────────┐
│                        INTERFAZ DE USUARIO                             │
├───────────────────────────────┬────────────────────────────────────────┤
│          APRENDIZ             │              INSTRUCTOR                │
│  - ApprenticeHeader           │  - InstructorDashboard                 │
│  - EvaluationSection          │  - Google Sign-In Button               │
│  - InductionModules           │  - Monitor de Sincronización en Vivo   │
└───────────────┬───────────────┴────────────────────┬───────────────────┘
                │ Disparo de eventos                 │ Iniciar / Cerrar
                ▼                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     googleSheetsService.ts                             │
│  - In-Memory Access Token (OAuth Google Workspace)                     │
│  - Provider con Scopes: spreadsheets + drive.file                      │
│  - Suscripción reactiva (subscribeSyncStatus)                          │
├────────────────────────────────────────────────────────────────────────┤
│                       BÚFER RESILIENTE                                 │
│  - Si hay Token & Sheet ID: POST inmediato a Google Sheets API v4       │
│  - Si no hay conexión: Almacenamiento en Cola Local (localStorage)     │
│  - Función flushQueue(): Despacho por lotes (batch append)             │
└───────────────┬────────────────────────────────────────────────────────┘
                │ HTTP REST (Bearer Authorization)
                ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 GOOGLE CLOUD PLATFORM / DRIVE API                      │
│  - sheets.googleapis.com/v4/spreadsheets/{id}/values/...:append        │
│  - Hoja: "SENA Regional Atlántico - Registro y Respuestas Inducción"   │
│  - Destino: Google Drive del Instructor                                │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Fases y Verificación

1. **Aprovisionamiento OAuth**: Scopes `spreadsheets` y `drive.file` validados en el proyecto de Google Cloud de la aplicación.
2. **Servicio y Conexión**: Verificación del flujo de inicio de sesión con ventana de consentimiento (`select_account consent`) y generación automática de la hoja con cabeceras congeladas.
3. **Pruebas de Flujo**:
   - Evaluación de preguntas por aprendices verificando la inserción de registros en Google Sheets.
   - Desconexión simulada y prueba de vaciado de cola acumulada.
   - Validación de compilación y ausencia de advertencias tipográficas (`compile_applet` y `lint_applet`).
