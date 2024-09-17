# Project - 3 mail

Esta es una aplicación de cliente de correo electrónico de una sola página (SPA) implementada en JavaScript, HTML y CSS. A continuación se detalla cómo está implementada la aplicación y cómo puedes utilizarla.

## Funcionalidades

### Enviar Correo

- **Descripción**: Permite a los usuarios enviar un correo electrónico.
- **Cómo Funciona**:
  - Cuando el usuario envía el formulario de composición de correo, se realiza una solicitud POST a `/emails`, pasando los valores para los destinatarios, asunto y cuerpo del correo.
  - Después de enviar el correo, la aplicación carga la bandeja de entrada del usuario.

### Bandejas de Entrada

- **Descripción**: Permite a los usuarios ver correos en su bandeja de entrada, enviados o archivados.
- **Cómo Funciona**:
  - Al visitar la bandeja de entrada, bandeja de enviados o archivo, se realiza una solicitud GET a `/emails/<mailbox>` para obtener los correos electrónicos de la bandeja seleccionada.
  - La aplicación muestra el nombre de la bandeja en la parte superior de la página.
  - Cada correo electrónico se muestra en una caja (`<div>`) que incluye el remitente, el asunto y la fecha/hora del correo.
  - Los correos electrónicos no leídos aparecen con un fondo blanco y los leídos con un fondo gris.

### Ver Correo

- **Descripción**: Permite a los usuarios ver el contenido completo de un correo electrónico.
- **Cómo Funciona**:
  - Al hacer clic en un correo electrónico, se realiza una solicitud GET a `/emails/<email_id>` para obtener el contenido del correo.
  - La aplicación muestra el remitente, destinatarios, asunto, fecha/hora y cuerpo del correo.
  - El correo se marca como leído mediante una solicitud PUT a `/emails/<email_id>`.

### Archivar y Desarchivar

- **Descripción**: Permite a los usuarios archivar y desarchivar correos electrónicos.
- **Cómo Funciona**:
  - Al ver un correo en la bandeja de entrada, el usuario puede archivarlo.
  - Al ver un correo en la bandeja de archivos, el usuario puede desarchivarlo.
  - Se realiza una solicitud PUT a `/emails/<email_id>` para marcar el correo como archivado o desarchivado.
  - Después de archivar o desarchivar un correo, se carga la bandeja de entrada del usuario.

### Responder

- **Descripción**: Permite a los usuarios responder a un correo electrónico.
- **Cómo Funciona**:
  - Al ver un correo electrónico, el usuario puede hacer clic en el botón "Responder" para componer una respuesta.
  - El formulario de composición de correo se rellena automáticamente con el destinatario como el remitente original, el asunto como "Re: [Asunto original]", y el cuerpo del correo incluye un texto que indica la fecha y el contenido original del correo.

## Instalación y Configuración

1. **Clonar el Repositorio**

    ```bash
    git clone https://github.com/juanjose23/mail.git
    cd mail
    ```

2. **Abrir `inbox.js`**

    - Asegúrate de que todos los requisitos están implementados en `inbox.js`.

3. **Abrir `index.html`**

    - Verifica que el HTML de la aplicación está configurado para funcionar con el código en `inbox.js`.

4. **Estilos CSS**

    - Asegúrate de que los estilos CSS estén aplicados correctamente para la aplicación en `style.css`.

## Uso

1. **Enviar Correo**: Completa el formulario de composición y envía un correo para que se agregue a la bandeja de enviados.

2. **Ver Bandejas**: Navega entre la bandeja de entrada, enviados y archivados para ver los correos electrónicos.

3. **Ver Correo**: Haz clic en un correo para ver su contenido completo y para marcarlo como leído.

4. **Archivar y Desarchivar**: Utiliza los botones en la vista del correo para archivar o desarchivar el correo.

5. **Responder**: Usa el botón "Responder" para responder a un correo y el formulario se rellenará automáticamente.

## Contribuciones

Si encuentras errores o deseas agregar nuevas funcionalidades, siéntete libre de bifurcar el repositorio y enviar una solicitud de extracción.

## Licencia

Este proyecto está bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.
