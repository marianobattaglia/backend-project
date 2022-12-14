# backend-project

Ecommerce project developed for the backend course. Commision 32080.

---

## Ejecutar aplicación:

Desde la terminal realizar los siguientes pasos:

1. **Clonar repositorio**

`git clone https://github.com/marianobattaglia/backend-project.git`

2. **Ingresar dentro de la carpeta del proyecto**

`cd backend-project`

3. **Instalar dependencias**

`npm install`

4. **Ejecutar en simultaneo, en diferentes terminales:**

`npm start`

`mongod --dbpath "\backend-project\data"`

`mongo`

---

## Update:

Se realizó Deploy de la App en Glitch para la **primer entrega del proyecto**, se puede ver desde el siguiente link:
https://glitch.com/~infrequent-time-kettle

---

# Cómo utilizar los endpoints

Se detalla a continuación cómo utilizar cada una de las rutas.

## Productos

### GET: Leer todos los productos

`http://localhost:8080/api/productos/`

### GET: Leer producto por "id"

`http://localhost:8080/api/productos/:id`

### POST: Crear un nuevo producto

`http://localhost:8080/api/productos/`

Se debe pasar un body con el siguiente formato:

<pre><code>{
    "name": "Producto nuevo",
    "description": "Este es un nuevo producto",
    "code": 1005,
    "thumbnail": "https://",
    "price": 2000,
    "stock": 15
}</code></pre>

### PUT: Modificar un producto por "id"

`http://localhost:8080/api/productos/:id`

Se debe pasar un body con el siguiente formato:

<pre><code>{
    "name": "Producto modificado",
    "description": "Este es un producto modificado",
    "code": 1005,
    "thumbnail": "https://",
    "price": 2000,
    "stock": 0
}</code></pre>

### DELETE: Eliminar un producto por "id"

`http://localhost:8080/api/productos/:id`

## Carritos

### GET: Leer todos los carritos

`http://localhost:8080/api/carritos/`

### GET: Leer productos de un carrito

`http://localhost:8080/api/carritos/:idCarrito/productos`

### POST: Crear un carrito nuevo

`http://localhost:8080/api/carritos/`

### POST: Insertar un producto al carrito

`http://localhost:8080/api/carritos/:idCart/productos`

Se debe pasar un body con el siguiente formato:

<pre><code>{
    "id": "6328e028e5e057a1755b98d6"
}</code></pre>

### DELETE: Eliminar un carrito

`http://localhost:8080/api/carritos/:id`

### DELETE: Eliminar un producto de un carrito

`http://localhost:8080/api/carritos/:idCarrito/productos/:idProducto`

---

# Consignas del trabajo

## PRIMER ENTREGA

### Consigna:

Deberás entregar el estado de avance de tu aplicación **eCommerce Backend**, que implemente un servidor de aplicación basado en la plataforma Node.js y el módulo express. El servidor implementará dos conjuntos de rutas agrupadas en routers, uno con la url base `'/productos'` y el otro con `'/carrito'`. El puerto de escucha será el 8080 para desarrollo y process.env.PORT para producción en glitch.com

### Aspectos a incluir en el entregable:

1. El router base `'/api/productos'` implementará cuatro funcionalidades:

   - GET: '/:id?' - Me permite listar todos los productos disponibles ó un producto por su id (disponible para usuarios y administradores)
   - POST: '/' - Para incorporar productos al listado (disponible para administradores)
   - PUT: '/:id' - Actualiza un producto por su id (disponible para administradores)
   - DELETE: '/:id' - Borra un producto por su id (disponible para administradores)

2. El router base `'/api/carrito'` implementará tres rutas disponibles para usuarios y administradores:
   - POST: '/' - Crea un carrito y devuelve su id.
   - DELETE: '/:id' - Vacía un carrito y lo elimina.
   - GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito
   - POST: '/:id/productos' - Para incorporar productos al carrito por su id de producto
   - DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto
3. Crear una variable booleana administrador, cuyo valor configuraremos más adelante con el sistema de login. Según su valor (true ó false) me permitirá alcanzar o no las rutas indicadas. En el caso de recibir un request a una ruta no permitida por el perfil, devolver un objeto de error. Ejemplo: { error : -1, descripcion: ruta 'x' método 'y' no autorizada }
4. Un **producto** dispondrá de los siguientes campos: id, timestamp, nombre, descripcion, código, foto (url), precio, stock.
5. El **carrito de compras** tendrá la siguiente estructura:
   id, timestamp(carrito), productos: { id, timestamp(producto), nombre, descripcion, código, foto (url), precio, stock }
6. El timestamp puede implementarse con Date.now()
7. Realizar la persistencia de productos y del carrito de compras en el filesystem.

## A tener en cuenta:

1. Para realizar la prueba de funcionalidad hay dos opciones:
   - Probar con postman cada uno de los endpoints (productos y carrito) y su operación en conjunto.
   - Realizar una aplicación frontend sencilla, utilizando HTML/CSS/JS ó algún framework de preferencia, que represente el listado de productos en forma de cards. En cada card figuran los datos del producto, que, en el caso de ser administradores, podremos editar su información. Para este último caso incorporar los botones actualizar y eliminar. También tendremos un formulario de ingreso de productos nuevos con los campos correspondientes y un botón enviar. Asimismo, construir la vista del carrito donde se podrán ver los productos agregados e incorporar productos a comprar por su id de producto. Esta aplicación de frontend debe enviar los requests get, post, put y delete al servidor utilizando fetch y debe estar ofrecida en su espacio público.
2. En todos los casos, el diálogo entre el frontend y el backend debe ser en formato JSON. El servidor no debe generar ninguna vista.
3. En el caso de requerir una ruta no implementada en el servidor, este debe contestar un objeto de error: ej { error : -2, descripcion: ruta 'x' método 'y' no implementada}
4. La estructura de programación será ECMAScript, separada tres en módulos básicos (router, lógica de negocio/api y persistencia ). Más adelante implementaremos el desarrollo en capas. Utilizar **preferentemente clases**, constructores de variables let y const y arrow function.
5. Realizar la prueba de funcionalidad completa en el ámbito local (puerto 8080) y en **glitch.com**

## SEGUNDA ENTREGA

### Consigna:

Basándose en los contenedores ya desarrollados (memoria, archivos) desarrollar dos contenedores más (que cumplan con la misma interfaz) que permitan realizar las operaciones básicas de CRUD en MongoDb (ya sea local o remoto) y en Firebase. Luego, para cada contenedor, crear dos clases derivadas, una para trabajar con Productos, y otra para trabajar con Carritos.
USAR FIREABASE Y MONGODB (local o remoto como quieras)
USAR UNA PARA CARRITO Y OTRA PARA PODUCTO (elegir a gusto)

### Aspectos a incluir en el entregable:

1. A las clases derivadas de los contenedores se las conoce como DAOs (Data Access Objects), y pueden ir todas incluidas en una misma carpeta de ‘daos’.
2. En la carpeta de daos, incluir un archivo que importe todas las clases y exporte una instancia de dao de productos y una de dao de carritos, según corresponda. Esta decisión se tomará en base al valor de una variable de entorno cargada al momento de ejecutar el servidor (opcional: investigar el uso de imports dinámicos).
3. Incluir un archivo de configuración (config) que contenga los datos correspondientes para conectarse a las bases de datos o medio de persistencia que corresponda.
4. Hacer lo mismo para bases de datos relacionales: MariaDB/SQLite3 (Opcional).

## TERCER ENTREGA

### Consigna:

- Se debe entregar un menú de registro y autenticación de usuarios basado en passport local, guardando en la base de datos las credenciales y el resto de los datos ingresados al momento del registro.

  - El registro de usuario consiste en crear una cuenta en el servidor almacenada en la base de datos, que contenga el email y password de usuario, además de su nombre, dirección, edad, número de teléfono (debe contener todos los prefijos internacionales) y foto ó avatar. La contraseña se almacenará encriptada en la base de datos.
  - La imagen se podrá subir al servidor y se guardará en una carpeta pública del mismo a la cual se tenga acceso por url.

- Un formulario post de registro y uno de login. De modo que, luego de concretarse cualquiera de estas operaciones en forma exitosa, el usuario accederá a su home.
  - El usuario se logueará al sistema con email y password y tendrá acceso a un menú en su vista, a modo de barra de navegación. Esto le permitirá ver los productos totales con los filtros que se hayan implementado y su propio carrito de compras e información propia (datos de registro con la foto). Además, dispondrá de una opción para desloguearse del sistema.
  - Ante la incorporación de un usuario, el servidor enviará un email al administrador con todos los datos de registro y asunto 'nuevo registro', a una dirección que se encuentre por el momento almacenada en una constante global.
- Envío de un email y un mensaje de whatsapp al administrador desde el servidor, a un número de contacto almacenado en una constante global.
  - El usuario iniciará la acción de pedido en la vista del carrito.
  - Será enviado una vez finalizada la elección para la realizar la compra de productos.
  - El email contendrá en su cuerpo la lista completa de productos a comprar y en el asunto la frase 'nuevo pedido de ' y el nombre y email del usuario que los solicitó. En el mensaje de whatsapp se debe enviar la misma información del asunto del email.
  - El usuario recibirá un mensaje de texto al número que haya registrado, indicando que su pedido ha sido recibido y se encuentra en proceso.

### Aspectos a incluir:

- El servidor trabajará con una base de datos DBaaS (Ej. MongoDB Atlas) y estará preparado para trabajar en forma local o en la nube a través de la plataforma PaaS Heroku.
- Habilitar el modo cluster para el servidor, como opcional a través de una constante global.
- Utilizar alguno de los loggers ya vistos y así reemplazar todos los mensajes a consola por logs eficientes hacia la misma consola. En el caso de errores moderados ó graves el log tendrá además como destino un archivo elegido.
- Realizar una prueba de performance en modo local, con y sin cluster, utilizando Artillery en el endpoint del listado de productos (con el usuario vez logueado). Verificar los resultados.
