# Feedback App — DriveMe

## Deploy

[https://proyecto-a-feedback-driveme.vercel.app](https://proyecto-a-feedback-driveme.vercel.app)

---

## Usuarios de prueba

| Rol                | Email                     | Contraseña |
|--------------------|---------------------------|------------|
| Administrador      | admin+clerk_test@iaw.com  | iawuser#   |
| Driver (conductor) | driver+clerk_test@iaw.com | iawuser#   |
| Rider (pasajero)   | rider+clerk_test@iaw.com  | iawuser#   |

---

## Instrucciones de uso

### Usuario final (Driver / Rider)
1. Iniciar sesión en [/sign-in](https://proyecto-a-feedback-driveme.vercel.app/sign-in) con las credenciales correspondientes.
2. Desde el **Dashboard** (`/dashboard`) se pueden ver todas las calificaciones recibidas y enviadas, organizadas en tres tabs: *Todas*, *Recibidas* y *Enviadas*. Cada tab tiene paginación independiente.
3. Desde una calificación recibida se puede **reportarla** si se considera injusta o inapropiada.
4. El botón **"Ver mi resumen de comentarios"** genera un análisis con IA de todos los comentarios recibidos (tendencias positivas, puntos a mejorar, recurrencia de temas).

### Administrador
1. Iniciar sesión con el usuario admin. El panel de moderación se encuentra en `/admin`.
2. La sección **Reportes Pendientes** muestra las calificaciones reportadas por usuarios, con opciones para aprobar o rechazar cada reporte.
3. La sección **Comentarios Marcados por IA** muestra los comentarios detectados automáticamente como inapropiados al momento de su creación, con opciones para aprobarlos o eliminarlos.
4. Desde `/admin/usuarios` se puede ver el listado completo de usuarios con su promedio de calificaciones, buscarlos por nombre, ver su historial y banearlos o desbanearlos.

### API
Los endpoints públicos de la app pueden probarse desde la consola del browser (con sesión activa) o con cualquier cliente HTTP. Ver documentación en [`docs/03-apis.md`](docs/03-apis.md).

---

## Descripción del proyecto

La **Feedback App** es el microservicio de calificaciones y reputación del sistema DriveMe, una plataforma de viajes compartidos. Su función principal es registrar las valoraciones que conductores y pasajeros se realizan mutuamente al finalizar cada viaje, y exponer esos datos al resto del sistema.

Cada calificación incluye un puntaje del 1 al 5 y un comentario opcional. Al crearse, el comentario pasa por un modelo de IA (Groq) que evalúa automáticamente si es inapropiado. Los comentarios marcados quedan ocultos para el receptor hasta que un administrador los revise. Los usuarios también pueden reportar manualmente calificaciones que consideren injustas, generando un flujo de moderación en el panel de administración.

El panel de administración incluye gestión de reportes pendientes, revisión de comentarios marcados por IA y administración de usuarios (con posibilidad de banear cuentas). Los usuarios finales cuentan con un dashboard personal donde pueden ver su historial completo de calificaciones y solicitar un análisis generado por IA sobre los comentarios que recibieron.

---

## Notas para la corrección

- **IA integrada en dos puntos:** (1) moderación automática de comentarios al registrar una calificación, usando Groq para detectar lenguaje inapropiado; (2) análisis bajo demanda desde el dashboard del usuario, que genera un resumen con tendencias positivas, puntos a mejorar y recurrencia de temas. 
Para probar la IA se puede usar el script test-ia.ts, usando el comando npx tsx scripts/test-ia.ts. Si no tenés tsx instalado:
npm install -D tsx
npx tsx scripts/test-ia.ts
O la otra forma es probar creando reseñas mediante el `POST /api/resenas` con un driver o rider, y podes probar poniendo insultos o inclusos palabras no ofensivas como "crack", la cual la IA la toma como ofensiva.


- **Roles de Clerk:** la app distingue tres roles (`moderator`, `driver`, `rider`) configurados en los `publicMetadata` de cada usuario en Clerk. El endpoint `POST /api/resenas` valida que el emisor tenga rol `driver` o `rider`. El panel `/admin` requiere rol `moderator`.

- **Situacion Particular con admin** La pagina de dashboard (la de ver mis calificaciones) la ve el admin ahora por comodidad para probar el sistema revisando como se visualizan las calificaciones, como funcionan los botones, como se reportan calificaciones, etc. Sin esto la prueba de estas cosas es tediosa ya que deberia iniciar sesion con driver o rider, probar como se comporta la pagina, luego reportar una calificacion, cerrar sesion de driver/rider, inciar sesion con admin, moderar el reporte, cerrar sesion e iniciar sesion con el driver/rider y ver como se comporto todo, y si hay un error despues queda repertir todo de nuevo. Para evitar este fastidio de prueba, el admin tiene un dashboard y la visualizacion de las pruebas es mucho mas rapida. En la etapa 3 se considerara que el admin no pueda acceder a ella, ya que el admin despues no va a tener calificaciones porque el POST para crear reseñas pide que sea un 'driver' o 'rider', y el admin es 'moderator' entonces no tiene sentido que el admin tenga esa pagina porque no va a ver nada. En resumen, tiene el dashboard porque al probar ciertas cosas del dashboard (como reportar una calificacion) era mas rapido ver como funcionaban si admin tiene esta pagina. 

- **Datos precargados:** la base de datos cuenta con un seed con tres usuarios (admin, rider, driver) con calificaciones, reportes en distintos estados y comentarios inapropiados, diseñado para poder evaluar todas las funcionalidades sin cargar datos manualmente. 
## El comando para volver a cargar la seed es npx prisma db seed

- **Las Best Practices de Lighthouse dan 77** porque Clerk utiliza cookies de terceros de Cloudflare (`__cf_bm`, `_cfuvid`) en su infraestructura propia (`accounts.dev`) para gestionar la autenticación. Estas cookies no son de la aplicación y no hay forma de eliminarlas o controlarlas desde el código. Es un costo inherente al uso de Clerk como servicio de autenticación.

- **APIs de otras apps mockeadas:** en esta etapa, las integraciones con la Driver App y la Rider App (notificación de reputación, verificación de viaje finalizado) están indicadas como `TODO` en el código y se loguean por consola en lugar de hacer el request real, según lo acordado para la Etapa 2.

- **Caso Particular** se sabe que en la lista de usuarios aparecen la gente que tiene reseñas, si no tenes reseñas no apareces. Eso por el momento decidi dejarlo asi pero si en la etapa 3 es necesario cambiarlo, se puede cambiar.
