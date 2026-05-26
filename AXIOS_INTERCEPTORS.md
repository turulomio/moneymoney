# Documentación de Interceptores de Axios

Se han implementado interceptores globales en `axios` para automatizar las tareas repetitivas de cabeceras, validación de respuestas y gestión de errores.

## 1. Automatización de Cabeceras (Request Interceptor)

Por defecto, todas las peticiones incluyen ahora:
- `Authorization`: Token de sesión (si existe en el store).
- `Accept-Language`: Idioma actual del navegador/usuario.
- `Content-Type`: `application/json`.

### Cómo usarlo
Ya no es necesario pasar `myheaders()` en cada llamada:

```javascript
// ANTES
axios.get(url, myheaders())

// AHORA
axios.get(url)
```

### Excepción: `noheaders`
Si necesitas realizar una petición sin estas cabeceras automáticas (por ejemplo, llamadas externas o procesos de login específicos):

```javascript
axios.get('https://api.externa.com', { noheaders: true })
```

---

## 2. Validación y Errores (Response Interceptor)

El interceptor de respuesta ejecuta automáticamente `parseResponse` y `parseResponseError`.

- **Si la respuesta es correcta (2xx):** Se valida el contenido. Si `parseResponse` detecta un error lógico (como "Wrong credentials"), se muestra el diálogo de alerta y la promesa se **cancela** (no entra en el `.then`).
- **Si hay un error (4xx, 5xx, Red):** Se ejecuta `parseResponseError` automáticamente, mostrando el diálogo correspondiente.

### Cómo usarlo
El código en los componentes se simplifica drásticamente:

```javascript
// ANTES
axios.post(url, data, myheaders())
  .then(async (response) => {
    if (await parseResponse(response)) {
      this.doSomething();
    }
  }, (error) => {
    parseResponseError(error);
  });

// AHORA
axios.post(url, data)
  .then((response) => {
    // Solo entra aquí si la respuesta es 2xx Y ha pasado parseResponse()
    this.doSomething();
  });
  // El .catch() es opcional si solo quieres manejar el error globalmente
```

### Excepción: `noparse`
Si quieres evitar que se muestren los diálogos automáticos y manejar tú mismo la respuesta o el error:

```javascript
axios.get(url, { noparse: true })
  .then(response => {
    // parseResponse NO se ha ejecutado
  })
  .catch(error => {
    // parseResponseError NO se ha ejecutado
  });
```

---

## 3. Resumen de Propiedades Personalizadas

| Propiedad | Tipo | Descripción |
| :--- | :--- | :--- |
| `noheaders` | Boolean | Si es `true`, no añade Token ni cabeceras de idioma automáticamente. |
| `noparse` | Boolean | Si es `true`, no ejecuta `parseResponse` ni `parseResponseError`. |

---

## 4. Migración Completada
El código legacy ha sido eliminado de `src/store.js` y de todos los componentes. Ya no es necesario utilizar banderas de transición. Se recomienda utilizar la sintaxis simplificada en todos los nuevos desarrollos.
