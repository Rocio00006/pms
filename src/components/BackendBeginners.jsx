import { useState } from "react";

const curriculum = {
  weeks: [
    {
      id: 1,
      emoji: "🌱",
      title: "Internet, Servidores y tu Primera API",
      tagline: "Entender cómo funciona la web por dentro",
      color: "#F97316",
      light: "#FFF7ED",
      border: "#FED7AA",
      days: [
        {
          day: 1,
          emoji: "🌐",
          title: "¿Cómo funciona Internet?",
          subtitle: "De escribir una URL a ver la página",
          analogy: "Imagina que Internet es como el sistema postal del mundo. Cuando escribes una URL en el navegador, es como enviar una carta: necesita una dirección (IP), un cartero (TCP/IP), y alguien que la reciba y responda (el servidor).",
          concept: `Cuando escribes "google.com" en tu navegador, ocurren estas cosas en milisegundos:\n\n1. Tu computadora pregunta "¿cuál es la dirección IP de google.com?" — esto se llama DNS (como buscar el número de teléfono de alguien en una agenda).\n\n2. Tu navegador se conecta a esa dirección IP usando TCP/IP (el "idioma" que hablan todas las computadoras en Internet).\n\n3. Tu navegador envía un mensaje HTTP que dice "por favor dame la página principal". Ese mensaje se llama REQUEST.\n\n4. El servidor de Google recibe esa petición, prepara la respuesta (el HTML de la página), y te la manda de vuelta. Eso es el RESPONSE.\n\n5. Tu navegador recibe el HTML y lo dibuja en pantalla.\n\nTú, como developer de backend, serás la persona que construye el SERVIDOR: el código que recibe esas peticiones y decide qué responder.`,
          questions: [
            "¿Qué es una dirección IP y por qué existe si ya tenemos nombres de dominio como 'google.com'?",
            "Si el navegador y el servidor se comunican con HTTP, ¿qué crees que pasa cuando la conexión se interrumpe a mitad de la descarga?",
            "¿Por qué crees que algunas webs cargan más rápido que otras? Menciona al menos 2 razones posibles."
          ],
          exercise: {
            title: "Explora una petición HTTP real",
            description: "Abre Chrome o Firefox, ve a cualquier página web, abre las DevTools (F12), ve a la pestaña 'Network', recarga la página y observa todas las peticiones que hace el navegador. Busca la primera petición (normalmente el HTML principal) y mira sus headers.",
            steps: [
              "Abre chrome.com en tu navegador",
              "Presiona F12 para abrir DevTools",
              "Haz clic en la pestaña 'Network'",
              "Recarga la página con Ctrl+R",
              "Haz clic en la primera petición de la lista",
              "Mira las pestañas 'Headers' y 'Response'"
            ],
            whatYouWillSee: "Verás cosas como 'Status Code: 200', 'Content-Type: text/html', y el HTML crudo que el servidor te mandó. ¡Eso es HTTP en acción!",
            code: null
          },
          concepts_box: [
            { term: "IP", simple: "La 'dirección postal' de una computadora en Internet. Ejemplo: 192.168.1.1" },
            { term: "DNS", simple: "La 'agenda telefónica' de Internet. Convierte 'google.com' → '142.250.80.46'" },
            { term: "HTTP", simple: "El 'idioma' que usan navegadores y servidores para hablar. Es texto con formato." },
            { term: "Request", simple: "El mensaje que TÚ (el navegador) le mandas al servidor. 'Dame esta página.'" },
            { term: "Response", simple: "La respuesta que el servidor te manda. Puede ser HTML, JSON, una imagen, etc." },
            { term: "Puerto", simple: "Como el número de apartamento en un edificio. HTTP usa el 80, HTTPS el 443." }
          ],
          resources: [
            { title: "¿Cómo funciona Internet? — Explicación visual (Khan Academy)", url: "https://es.khanacademy.org/computing/computers-and-internet/xcae6f4a7ff015e7d:the-internet" },
            { title: "HTTP: Let's GET It On — MDN en español", url: "https://developer.mozilla.org/es/docs/Web/HTTP/Overview" },
            { title: "Visualización interactiva de DNS", url: "https://messwithdns.net" }
          ]
        },
        {
          day: 2,
          emoji: "📦",
          title: "¿Qué es un servidor y qué hace?",
          subtitle: "Tu primera vez corriendo un servidor real",
          analogy: "Un servidor es como un restaurante. El cliente (navegador) llega, hace un pedido (request), el cocinero (tu código) prepara la respuesta, y el mesero (HTTP) la entrega. Tú eres el cocinero — decides qué hay en el menú y cómo prepararlo.",
          concept: `Un servidor web es simplemente un PROGRAMA que está corriendo en una computadora, escuchando peticiones que llegan por la red y respondiendo a ellas.\n\nNo hay nada mágico. Cuando instalas Node.js en tu computadora, esa misma máquina puede convertirse en un servidor. La diferencia con los servidores "de verdad" es que ellos están prendidos 24/7 y tienen una IP pública para que el mundo los pueda encontrar.\n\nNode.js es un entorno que te permite correr JavaScript fuera del navegador. Antes de Node.js (2009), JavaScript solo vivía en el navegador. Node.js liberó JavaScript y lo convirtió en un lenguaje que puede hacer de todo: servidores web, scripts, herramientas de línea de comandos, etc.\n\nExpress es el framework más popular para crear servidores con Node.js. Un framework es como un "kit de herramientas" que ya resuelve los problemas comunes para que tú te enfoques en la lógica de tu aplicación.`,
          questions: [
            "Si un servidor es solo un programa, ¿podrías correr un servidor en tu laptop de casa? ¿Qué problema tendría eso para una app real?",
            "¿Qué diferencia hay entre el 'frontend' (lo que ve el usuario) y el 'backend' (el servidor)? ¿Por qué necesitamos los dos?",
            "¿Por qué crees que existe Express si Node.js ya puede hacer servidores por sí solo?"
          ],
          exercise: {
            title: "Tu primer servidor con Node.js",
            description: "Instala Node.js si no lo tienes (nodejs.org), crea un archivo server.js y corre tu primer servidor. Cuando lo abras en el navegador, deberías ver '¡Hola Mundo!'",
            steps: [
              "Instala Node.js desde nodejs.org (elige la versión LTS)",
              "Crea una carpeta llamada 'mi-primer-servidor'",
              "Dentro, crea el archivo server.js con el código de abajo",
              "Abre la terminal en esa carpeta",
              "Corre: node server.js",
              "Abre tu navegador en: http://localhost:3000"
            ],
            whatYouWillSee: "Tu navegador mostrará '¡Hola Mundo desde mi servidor!' — ¡acabas de crear y correr un servidor web!",
            code: `// server.js — Tu primer servidor web
const http = require('http'); // Módulo nativo de Node.js

// Creamos el servidor
const servidor = http.createServer((peticion, respuesta) => {
  
  // Esto se ejecuta CADA VEZ que alguien hace una petición
  console.log('¡Alguien visitó el servidor!');
  console.log('Ruta visitada:', peticion.url);
  
  // Le decimos que la respuesta es texto HTML y que todo salió bien (200)
  respuesta.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  
  // Enviamos la respuesta
  respuesta.end('<h1>¡Hola Mundo desde mi servidor!</h1><p>Funciona 🎉</p>');
});

// El servidor escucha en el puerto 3000
servidor.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
  console.log('Presiona Ctrl+C para detenerlo');
});`
          },
          concepts_box: [
            { term: "Node.js", simple: "Un programa que te permite correr JavaScript en tu computadora (no solo en el navegador)." },
            { term: "npm", simple: "El 'app store' de Node.js. Te permite instalar librerías de código que otros crearon." },
            { term: "localhost", simple: "Apunta a TU propia computadora. Es como decir 'aquí mismo'." },
            { term: "Puerto", simple: "El 3000 en 'localhost:3000'. Un número que identifica qué programa recibe la conexión." },
            { term: "require()", simple: "La forma de importar módulos (código de otros) en Node.js." },
            { term: "Express", simple: "Un framework popular que hace más fácil crear servidores con Node.js." }
          ],
          resources: [
            { title: "Node.js — Sitio oficial (descarga aquí)", url: "https://nodejs.org" },
            { title: "Introducción a Node.js — NodeSchool (interactivo)", url: "https://nodeschool.io/es" },
            { title: "¿Qué es Node.js? — freeCodeCamp en español", url: "https://www.freecodecamp.org/espanol/news/que-es-node-js" }
          ]
        },
        {
          day: 3,
          emoji: "🛣️",
          title: "Rutas y el método HTTP",
          subtitle: "GET, POST y las URLs que tú diseñas",
          analogy: "Las rutas son como las páginas de un menú. '/inicio' lleva a la página principal, '/usuarios' a la lista de usuarios, '/productos/123' al producto con ID 123. Tú decides qué existe en el menú y qué hace cada opción.",
          concept: `Cuando construyes un servidor, defines RUTAS: combinaciones de método HTTP + URL que tu servidor entiende.\n\nLos métodos HTTP más usados son:\n\n• GET → Pedir/leer información. "Dame los usuarios." Sin modificar nada.\n• POST → Enviar/crear algo nuevo. "Crea este nuevo usuario con estos datos."\n• PUT → Reemplazar algo. "Reemplaza el usuario 5 con estos nuevos datos."\n• PATCH → Modificar algo parcialmente. "Cambia solo el email del usuario 5."\n• DELETE → Eliminar algo. "Borra el usuario 5."\n\nCon Express, defines rutas así:\napp.get('/ruta', función) → cuando alguien hace GET a /ruta\napp.post('/ruta', función) → cuando alguien hace POST a /ruta\n\nEstas rutas forman lo que se llama una API (Application Programming Interface): el "menú" de cosas que tu servidor sabe hacer.`,
          questions: [
            "Si un navegador al escribir una URL siempre hace GET, ¿cómo crees que los formularios de inicio de sesión envían el usuario y contraseña? ¿Qué método usan?",
            "¿Por qué existe una distinción entre GET y POST si técnicamente podrías usar GET para todo? ¿Qué problema generaría?",
            "Imagina que estás diseñando la API de una app de tareas (to-do). ¿Qué rutas crearía? Describe al menos 4."
          ],
          exercise: {
            title: "API de tareas con Express",
            description: "Instala Express y crea una API básica con rutas GET y POST para una lista de tareas en memoria. Usa Insomnia o Postman para probar las rutas POST (ya que el navegador solo hace GET).",
            steps: [
              "En tu carpeta, corre: npm init -y",
              "Instala Express: npm install express",
              "Crea app.js con el código de abajo",
              "Corre: node app.js",
              "Abre http://localhost:3000/tareas en el navegador (GET)",
              "Instala Insomnia (insomnia.rest) o usa Thunder Client en VSCode",
              "Haz un POST a http://localhost:3000/tareas con body JSON"
            ],
            whatYouWillSee: "El GET te devolverá la lista de tareas. El POST añadirá una nueva tarea y te la devolverá confirmada.",
            code: `// app.js — API de tareas con Express
const express = require('express');
const app = express();

// Esto permite que Express entienda JSON en el body de las peticiones
app.use(express.json());

// Base de datos FALSA — solo vive en memoria (se borra al reiniciar)
let tareas = [
  { id: 1, titulo: 'Aprender Node.js', completada: false },
  { id: 2, titulo: 'Crear mi primera API', completada: false },
];
let siguienteId = 3;

// GET /tareas → devuelve todas las tareas
app.get('/tareas', (req, res) => {
  res.json(tareas); // res.json() envía la respuesta como JSON
});

// GET /tareas/:id → devuelve UNA tarea por su ID
app.get('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id); // req.params tiene los :parametros de la URL
  const tarea = tareas.find(t => t.id === id);
  
  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  
  res.json(tarea);
});

// POST /tareas → crea una nueva tarea
app.post('/tareas', (req, res) => {
  const { titulo } = req.body; // req.body tiene los datos que mandó el cliente
  
  if (!titulo) {
    return res.status(400).json({ error: 'El campo titulo es requerido' });
  }
  
  const nuevaTarea = { id: siguienteId++, titulo, completada: false };
  tareas.push(nuevaTarea);
  
  res.status(201).json(nuevaTarea); // 201 = "Created"
});

// DELETE /tareas/:id → elimina una tarea
app.delete('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tareas.findIndex(t => t.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  
  tareas.splice(index, 1);
  res.status(204).send(); // 204 = "No Content" (éxito, sin cuerpo)
});

app.listen(3000, () => {
  console.log('API de tareas corriendo en http://localhost:3000');
});`
          },
          concepts_box: [
            { term: "Ruta / Endpoint", simple: "Una URL específica que tu servidor entiende. Ej: GET /usuarios, POST /login." },
            { term: "req (request)", simple: "El objeto con toda la info de la petición: URL, método, datos enviados, headers, etc." },
            { term: "res (response)", simple: "El objeto que usas para construir y enviar la respuesta al cliente." },
            { term: "req.params", simple: "Los valores variables en la URL. En '/tareas/:id', el :id es un param." },
            { term: "req.body", simple: "Los datos que el cliente envió en el cuerpo de la petición (normalmente JSON)." },
            { term: "res.status()", simple: "El código numérico que indica si todo salió bien (200, 201) o hubo error (400, 404, 500)." }
          ],
          resources: [
            { title: "Express.js — Guía oficial de routing", url: "https://expressjs.com/es/guide/routing.html" },
            { title: "Insomnia — Cliente HTTP para probar APIs (descarga)", url: "https://insomnia.rest" },
            { title: "Códigos de estado HTTP — MDN", url: "https://developer.mozilla.org/es/docs/Web/HTTP/Status" }
          ]
        },
        {
          day: 4,
          emoji: "🗄️",
          title: "Bases de datos: guardar datos de verdad",
          subtitle: "Conectar tu API a una base de datos real",
          analogy: "Hasta ahora tus datos se guardaban en una lista de JavaScript que desaparecía al reiniciar el servidor. Una base de datos es como un archivero metálico que sobrevive a los reinicios, guarda millones de registros y te permite buscarlos rápidamente.",
          concept: `Las bases de datos son programas especializados en guardar y recuperar datos de forma eficiente y persistente.\n\nExisten dos grandes familias:\n\n📊 SQL (Relacionales) — los datos se guardan en TABLAS con COLUMNAS fijas, como hojas de cálculo. Ejemplos: PostgreSQL, MySQL, SQLite. Son perfectas para la mayoría de aplicaciones.\n\n📄 NoSQL (No relacionales) — más flexibles, los datos se guardan de distintas formas (documentos, pares clave-valor, grafos). Ejemplos: MongoDB, Redis.\n\nPara empezar, usaremos SQLite — es un archivo en tu computadora, no necesitas instalar nada extra. Perfecta para aprender.\n\nSQL (Structured Query Language) es el lenguaje para hablar con bases de datos relacionales. Las 4 operaciones básicas se llaman CRUD:\n• CREATE → INSERT INTO\n• READ → SELECT\n• UPDATE → UPDATE\n• DELETE → DELETE`,
          questions: [
            "¿Por qué no podemos simplemente guardar los datos en un archivo de texto en lugar de usar una base de datos? ¿Qué ventajas tiene una base de datos?",
            "Imagina una app de Instagram simplificada. ¿Qué tablas necesitarías? ¿Qué columnas tendría la tabla de 'posts'?",
            "Si dos usuarios editan el mismo dato al mismo tiempo, ¿qué problema podría ocurrir? ¿Cómo crees que las bases de datos lo resuelven?"
          ],
          exercise: {
            title: "Conectar la API de tareas a SQLite",
            description: "Instala better-sqlite3 y migra la API de tareas para usar una base de datos SQLite real en lugar del array en memoria.",
            steps: [
              "Instala la librería: npm install better-sqlite3",
              "Reemplaza app.js con el código de abajo",
              "Corre el servidor: node app.js",
              "Crea algunas tareas con POST",
              "Reinicia el servidor (Ctrl+C, node app.js)",
              "Haz GET /tareas — ¡los datos siguen ahí!"
            ],
            whatYouWillSee: "A diferencia de antes, los datos persisten aunque reinicies el servidor. Se creará un archivo 'tareas.db' en tu carpeta.",
            code: `// app.js — API de tareas con SQLite real
const express = require('express');
const Database = require('better-sqlite3');

const app = express();
app.use(express.json());

// Abre (o crea) la base de datos
const db = new Database('tareas.db');

// Crea la tabla si no existe (esto es una "migración")
db.exec(\`
  CREATE TABLE IF NOT EXISTS tareas (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo    TEXT NOT NULL,
    completada INTEGER DEFAULT 0,  -- SQLite usa 0/1 para booleanos
    creada_en TEXT DEFAULT (datetime('now'))
  )
\`);

// GET /tareas → leer todas
app.get('/tareas', (req, res) => {
  const tareas = db.prepare('SELECT * FROM tareas').all();
  res.json(tareas);
});

// GET /tareas/:id → leer una
app.get('/tareas/:id', (req, res) => {
  const tarea = db.prepare('SELECT * FROM tareas WHERE id = ?').get(req.params.id);
  if (!tarea) return res.status(404).json({ error: 'No encontrada' });
  res.json(tarea);
});

// POST /tareas → crear
app.post('/tareas', (req, res) => {
  const { titulo } = req.body;
  if (!titulo) return res.status(400).json({ error: 'El titulo es requerido' });
  
  const resultado = db
    .prepare('INSERT INTO tareas (titulo) VALUES (?)')
    .run(titulo);
  
  // Recuperamos la tarea recién creada para devolverla
  const nuevaTarea = db
    .prepare('SELECT * FROM tareas WHERE id = ?')
    .get(resultado.lastInsertRowid);
  
  res.status(201).json(nuevaTarea);
});

// PATCH /tareas/:id → marcar como completada
app.patch('/tareas/:id', (req, res) => {
  const { completada } = req.body;
  
  db.prepare('UPDATE tareas SET completada = ? WHERE id = ?')
    .run(completada ? 1 : 0, req.params.id);
  
  const tarea = db.prepare('SELECT * FROM tareas WHERE id = ?')
    .get(req.params.id);
  
  res.json(tarea);
});

// DELETE /tareas/:id → eliminar
app.delete('/tareas/:id', (req, res) => {
  const resultado = db
    .prepare('DELETE FROM tareas WHERE id = ?')
    .run(req.params.id);
  
  if (resultado.changes === 0) {
    return res.status(404).json({ error: 'No encontrada' });
  }
  
  res.status(204).send();
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));`
          },
          concepts_box: [
            { term: "SQL", simple: "Lenguaje para hablar con bases de datos. SELECT, INSERT, UPDATE, DELETE son sus palabras básicas." },
            { term: "Tabla", simple: "Como una hoja de Excel. Tiene columnas (campos) y filas (registros)." },
            { term: "CRUD", simple: "Create, Read, Update, Delete — las 4 operaciones básicas sobre datos." },
            { term: "PRIMARY KEY", simple: "Un ID único para cada fila. Garantiza que puedas identificar cada registro." },
            { term: "AUTOINCREMENT", simple: "El número del ID sube solo (1, 2, 3...) sin que tú lo pongas manualmente." },
            { term: "Migración", simple: "Un script que crea o modifica la estructura de tu base de datos (las tablas)." }
          ],
          resources: [
            { title: "SQLite — Tutorial interactivo en español", url: "https://www.sqlitetutorial.net" },
            { title: "SQL para principiantes — freeCodeCamp", url: "https://www.freecodecamp.org/espanol/news/aprende-sql-en-10-minutos" },
            { title: "DB Browser for SQLite — ver tu base de datos visualmente", url: "https://sqlitebrowser.org" }
          ]
        },
        {
          day: 5,
          emoji: "🔐",
          title: "Variables de entorno y proyecto final de semana",
          subtitle: "Proteger secretos y conectar todo",
          analogy: "Las variables de entorno son como Post-its privados en tu escritorio. Las contraseñas de la base de datos, las claves secretas, las URLs del servidor — esas cosas nunca van en el código. Van en un archivo .env que solo tú ves y que nunca se sube a GitHub.",
          concept: `Una cosa crítica antes de compartir tu código con el mundo: NUNCA pongas contraseñas, API keys ni URLs privadas directamente en tu código.\n\nEjemplo de lo que NO se debe hacer:\nconst password = "miContraseñaSecreta123"; // 🚨 MALO\n\nLo correcto es usar VARIABLES DE ENTORNO: valores que se configuran en el entorno donde corre tu aplicación, fuera del código.\n\nUsamos un archivo llamado .env para guardar estos valores durante desarrollo. La librería dotenv los carga automáticamente.\n\n¿Por qué es tan importante? Porque:\n1. Tu código puede estar en GitHub (público) pero los secretos no\n2. En producción (el servidor real), los secretos se configuran diferente\n3. Diferentes entornos (dev, test, producción) tienen diferentes valores\n\nHoy también conectarás el frontend con tu API con CORS, y tendrás un proyecto completo funcionando.`,
          questions: [
            "¿Por qué es peligroso subir un archivo .env a GitHub? ¿Qué podría hacer alguien si encuentra tus API keys en un repositorio público?",
            "¿Qué diferencia hay entre el entorno de 'desarrollo' (tu laptop) y el entorno de 'producción' (el servidor real)? ¿Por qué necesitan configuraciones diferentes?",
            "¿Qué es CORS y por qué el navegador bloquea peticiones a dominios distintos? ¿Cuándo querrías permitirlo y cuándo no?"
          ],
          exercise: {
            title: "Proyecto completo: API + .env + CORS",
            description: "Agrega variables de entorno a tu proyecto de tareas, configura CORS para que un frontend pueda llamarla, y crea un archivo HTML simple que use tu API.",
            steps: [
              "Instala las librerías: npm install dotenv cors",
              "Crea el archivo .env con el contenido de abajo",
              "Crea un archivo .gitignore y añade '.env' y 'node_modules'",
              "Actualiza app.js para usar dotenv y cors",
              "Crea index.html para el frontend",
              "Abre index.html en el navegador y prueba la app completa"
            ],
            whatYouWillSee: "Una mini app web que muestra y crea tareas usando tu API. El frontend (HTML) habla con el backend (Express) que guarda en la base de datos.",
            code: `// .env — Variables de entorno (¡nunca subir a GitHub!)
PORT=3000
NODE_ENV=development
DB_NAME=tareas.db

// .gitignore
node_modules/
.env
*.db

// app.js actualizado
require('dotenv').config(); // Carga las variables del .env
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000; // Usa variable de entorno
const DB_NAME = process.env.DB_NAME || 'tareas.db';

app.use(cors()); // Permite que cualquier frontend llame a tu API
app.use(express.json());

const db = new Database(DB_NAME);
db.exec(\`
  CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    completada INTEGER DEFAULT 0
  )
\`);

// ... (mismas rutas de ayer)

app.listen(PORT, () => {
  console.log(\`Servidor corriendo en http://localhost:\${PORT}\`);
  console.log(\`Entorno: \${process.env.NODE_ENV}\`);
});

// index.html — Frontend simple que usa tu API
<!DOCTYPE html>
<html lang="es">
<body>
  <h1>Mis Tareas</h1>
  <input id="nueva" placeholder="Nueva tarea..." />
  <button onclick="crearTarea()">Añadir</button>
  <ul id="lista"></ul>
  
  <script>
    const API = 'http://localhost:3000';
    
    async function cargarTareas() {
      const res = await fetch(\`\${API}/tareas\`);
      const tareas = await res.json();
      document.getElementById('lista').innerHTML = 
        tareas.map(t => \`<li>\${t.titulo}</li>\`).join('');
    }
    
    async function crearTarea() {
      const titulo = document.getElementById('nueva').value;
      await fetch(\`\${API}/tareas\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo })
      });
      cargarTareas();
    }
    
    cargarTareas(); // Cargar al inicio
  </script>
</body>
</html>`
          },
          concepts_box: [
            { term: ".env", simple: "Archivo donde guardas los secretos (contraseñas, claves). No se sube a Git." },
            { term: "process.env", simple: "En Node.js, así accedes a las variables de entorno. Ej: process.env.PORT" },
            { term: "dotenv", simple: "Librería que carga el archivo .env en process.env automáticamente." },
            { term: "CORS", simple: "Mecanismo de seguridad del navegador. Bloquea peticiones entre dominios distintos por defecto." },
            { term: ".gitignore", simple: "Archivo que le dice a Git qué archivos NO incluir en el repositorio." },
            { term: "fetch()", simple: "Función de JavaScript para hacer peticiones HTTP desde el navegador." }
          ],
          resources: [
            { title: "dotenv — npm documentation", url: "https://www.npmjs.com/package/dotenv" },
            { title: "CORS explicado con diagramas — web.dev", url: "https://web.dev/cross-origin-resource-sharing" },
            { title: "Git y GitHub para principiantes — freeCodeCamp", url: "https://www.freecodecamp.org/espanol/news/git-y-github-curso-de-control-de-versiones" }
          ]
        }
      ]
    },
    {
      id: 2,
      emoji: "🏗️",
      title: "Bases de Datos Relacionales y PostgreSQL",
      tagline: "Modelar datos como un profesional",
      color: "#0EA5E9",
      light: "#F0F9FF",
      border: "#BAE6FD",
      days: [
        {
          day: 6,
          emoji: "🔗",
          title: "Relaciones entre tablas",
          subtitle: "Usuarios, posts y comentarios — datos conectados",
          analogy: "En la vida real, los datos están relacionados. Un usuario tiene muchos posts. Un post pertenece a un usuario. Un post tiene muchos comentarios. Las bases de datos relacionales están diseñadas exactamente para modelar estas relaciones de forma eficiente.",
          concept: `El verdadero poder de SQL está en las RELACIONES entre tablas y en los JOINs para consultarlas juntas.\n\nTipos de relaciones:\n\n• Uno a Uno (1:1) — Un usuario tiene un perfil. Un perfil pertenece a un usuario.\n• Uno a Muchos (1:N) — Un usuario tiene muchos posts. Cada post pertenece a un usuario.\n• Muchos a Muchos (N:M) — Un post puede tener muchos tags. Un tag puede estar en muchos posts. (Necesita tabla intermedia)\n\nLas relaciones se implementan con FOREIGN KEYS: una columna que apunta al ID de otra tabla.\n\nPara consultar datos de múltiples tablas, se usa JOIN:\n• INNER JOIN → solo los registros que tienen coincidencia en AMBAS tablas\n• LEFT JOIN → todos los de la tabla izquierda, aunque no tengan coincidencia\n\nEsto es fundamental. Aprender JOINs correctamente te separa de un desarrollador junior de uno senior.`,
          questions: [
            "Si un usuario se elimina, ¿qué debería pasar con sus posts? ¿Y con sus comentarios? ¿Debería la base de datos manejarlo automáticamente?",
            "¿Por qué no simplemente guardamos el nombre del usuario directamente en la tabla de posts en lugar de guardar su ID? ¿Qué problemas evita usar el ID?",
            "Diseña las tablas para una app de mensajería tipo WhatsApp. ¿Qué tablas necesitas? ¿Cómo modelarías los grupos?"
          ],
          exercise: {
            title: "Base de datos de blog con relaciones y JOINs",
            description: "Crea una base de datos de blog con usuarios, posts y comentarios. Practica INNER JOIN y LEFT JOIN para recuperar datos relacionados.",
            steps: [
              "Instala PostgreSQL o usa SQLite con el código de abajo",
              "Ejecuta el script de creación de tablas",
              "Inserta datos de prueba",
              "Practica las queries de JOIN"
            ],
            whatYouWillSee: "Aprenderás a recuperar 'todos los posts con el nombre de su autor' en una sola query en lugar de hacer múltiples consultas.",
            code: `-- Script SQL — Base de datos de blog

-- Tabla de usuarios
CREATE TABLE usuarios (
  id        SERIAL PRIMARY KEY,
  nombre    TEXT NOT NULL,
  email     TEXT UNIQUE NOT NULL,
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Tabla de posts (tiene FOREIGN KEY a usuarios)
CREATE TABLE posts (
  id          SERIAL PRIMARY KEY,
  titulo      TEXT NOT NULL,
  contenido   TEXT,
  usuario_id  INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  publicado   BOOLEAN DEFAULT false,
  creado_en   TIMESTAMP DEFAULT NOW()
);

-- Tabla de comentarios
CREATE TABLE comentarios (
  id         SERIAL PRIMARY KEY,
  texto      TEXT NOT NULL,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  post_id    INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  creado_en  TIMESTAMP DEFAULT NOW()
);

-- Insertar datos de prueba
INSERT INTO usuarios (nombre, email) VALUES
  ('Ana García', 'ana@ejemplo.com'),
  ('Carlos López', 'carlos@ejemplo.com');

INSERT INTO posts (titulo, contenido, usuario_id, publicado) VALUES
  ('Mi primer post', 'Hola mundo!', 1, true),
  ('Aprendiendo SQL', 'Los JOINs son increíbles', 1, true),
  ('Draft privado', 'Esto no está publicado', 2, false);

INSERT INTO comentarios (texto, usuario_id, post_id) VALUES
  ('¡Excelente post!', 2, 1),
  ('Muy útil, gracias', 1, 2);

-- INNER JOIN — Posts con el nombre de su autor
SELECT 
  posts.titulo,
  posts.creado_en,
  usuarios.nombre AS autor
FROM posts
INNER JOIN usuarios ON posts.usuario_id = usuarios.id
WHERE posts.publicado = true;

-- LEFT JOIN — Todos los posts, tengan o no comentarios
SELECT 
  posts.titulo,
  COUNT(comentarios.id) AS total_comentarios
FROM posts
LEFT JOIN comentarios ON comentarios.post_id = posts.id
GROUP BY posts.id, posts.titulo
ORDER BY total_comentarios DESC;`
          },
          concepts_box: [
            { term: "FOREIGN KEY", simple: "Una columna que guarda el ID de un registro de otra tabla. Crea la 'relación'." },
            { term: "INNER JOIN", simple: "Combina filas de dos tablas donde HAY coincidencia. Si no hay match, la fila no aparece." },
            { term: "LEFT JOIN", simple: "Devuelve TODAS las filas de la tabla izquierda, aunque no haya coincidencia en la derecha." },
            { term: "ON DELETE CASCADE", simple: "Si borras el padre (usuario), automáticamente se borran sus hijos (posts)." },
            { term: "GROUP BY", simple: "Agrupa filas con el mismo valor para poder hacer sumas, conteos, etc." },
            { term: "COUNT()", simple: "Función que cuenta cuántas filas hay en un grupo." }
          ],
          resources: [
            { title: "SQL JOINs — W3Schools interactivo", url: "https://www.w3schools.com/sql/sql_join.asp" },
            { title: "SQLZoo — Ejercicios de SQL interactivos", url: "https://sqlzoo.net/wiki/SQL_Tutorial/es" },
            { title: "Diagrama de JOINs — explicación visual", url: "https://www.codeproject.com/Articles/33052/Visual-Representation-of-SQL-Joins" }
          ]
        },
        {
          day: 7,
          emoji: "🐘",
          title: "PostgreSQL y un ORM real",
          subtitle: "De SQLite a una base de datos de producción",
          analogy: "SQLite es como una calculadora de bolsillo — perfecta para aprender. PostgreSQL es como una calculadora científica profesional. Funciona en producción, maneja miles de usuarios simultáneos, y tiene características avanzadas. Es el estándar de la industria.",
          concept: `PostgreSQL es la base de datos relacional de código abierto más avanzada del mundo. Es lo que usan startups y empresas grandes por igual.\n\nPrisma es un ORM (Object-Relational Mapper) moderno que te permite:\n1. Definir tu esquema de base de datos en un archivo .prisma\n2. Generar automáticamente el código para hacer queries\n3. Escribir queries en JavaScript en lugar de SQL crudo\n4. Hacer migraciones de forma controlada\n\nEl flujo con Prisma es:\n1. Defines tus modelos en schema.prisma\n2. Corres 'npx prisma migrate dev'\n3. Prisma crea las tablas en la base de datos\n4. Usas prisma.usuario.findMany() en lugar de escribir SQL\n\n¿Cuándo usar SQL crudo vs. ORM? Para aprender, empieza con SQL crudo para entender lo que pasa. Luego usa un ORM para ser más productivo en proyectos reales.`,
          questions: [
            "¿Cuál es la ventaja de usar Prisma (ORM) en lugar de escribir SQL directamente? ¿Cuándo podría ser una desventaja?",
            "Cuando dices 'npx prisma migrate dev', ¿qué está pasando exactamente? ¿Por qué es importante guardar historial de migraciones?",
            "Compara: prisma.post.findMany({ where: { publicado: true } }) vs. SELECT * FROM posts WHERE publicado = true. ¿Cuál prefieres? ¿Cuándo cambiarías de opinión?"
          ],
          exercise: {
            title: "API de blog con PostgreSQL + Prisma",
            description: "Configura PostgreSQL (o usa un servicio gratuito como Supabase), instala Prisma y reconstruye la API del blog usando el ORM.",
            steps: [
              "Crea una cuenta en supabase.com (PostgreSQL gratis) o instala PostgreSQL local",
              "Crea un nuevo proyecto y copia la CONNECTION STRING",
              "npm install @prisma/client, npm install -D prisma",
              "npx prisma init — crea los archivos de configuración",
              "Edita prisma/schema.prisma con los modelos de abajo",
              "npx prisma migrate dev --name init",
              "Crea la API con el código de abajo"
            ],
            whatYouWillSee: "Una API de blog conectada a PostgreSQL real. Los datos persisten en la nube y Prisma genera un cliente con autocompletado.",
            code: `// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Usuario {
  id        Int        @id @default(autoincrement())
  nombre    String
  email     String     @unique
  creadoEn  DateTime   @default(now())
  posts     Post[]     // Un usuario tiene muchos posts
  comentarios Comentario[]
}

model Post {
  id          Int          @id @default(autoincrement())
  titulo      String
  contenido   String?
  publicado   Boolean      @default(false)
  creadoEn    DateTime     @default(now())
  usuario     Usuario      @relation(fields: [usuarioId], references: [id])
  usuarioId   Int
  comentarios Comentario[]
}

model Comentario {
  id        Int      @id @default(autoincrement())
  texto     String
  creadoEn  DateTime @default(now())
  usuario   Usuario  @relation(fields: [usuarioId], references: [id])
  usuarioId Int
  post      Post     @relation(fields: [postId], references: [id])
  postId    Int
}

// api/posts.js — Queries con Prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener todos los posts publicados con su autor
app.get('/posts', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { publicado: true },
    include: {
      usuario: { select: { nombre: true, email: true } },
      _count: { select: { comentarios: true } }
    },
    orderBy: { creadoEn: 'desc' }
  });
  res.json(posts);
});`
          },
          concepts_box: [
            { term: "ORM", simple: "Herramienta que convierte objetos de código en filas de base de datos y viceversa. Evita escribir SQL manualmente." },
            { term: "Schema de Prisma", simple: "Archivo .prisma donde defines tus modelos (tablas) y sus relaciones." },
            { term: "Migración", simple: "Script que cambia la estructura de la DB de forma controlada y reversible." },
            { term: "include", simple: "En Prisma, le dice que traiga también los datos relacionados (como JOIN en SQL)." },
            { term: "Supabase", simple: "Servicio gratuito en la nube que te da PostgreSQL sin instalar nada." },
            { term: "CONNECTION STRING", simple: "URL con todos los datos para conectarse a la DB. Ej: postgresql://user:pass@host/db" }
          ],
          resources: [
            { title: "Prisma — Getting Started (oficial)", url: "https://www.prisma.io/docs/getting-started" },
            { title: "Supabase — PostgreSQL gratis en la nube", url: "https://supabase.com" },
            { title: "Tutorial Prisma + Express completo", url: "https://www.prisma.io/express" }
          ]
        },
        {
          day: 8,
          emoji: "🔑",
          title: "Autenticación: login y registro",
          subtitle: "Contraseñas seguras, JWT y rutas protegidas",
          analogy: "La autenticación es como el portero de un club. Primero verificas que la persona es quien dice ser (login). Luego le das una pulsera (JWT token) que demuestra que ya pasó el control. Para entrar de nuevo, muestra la pulsera — no tiene que volver a identificarse cada vez.",
          concept: `Implementar autenticación tiene dos partes:\n\n1. REGISTRO Y LOGIN:\n• El usuario se registra con email + contraseña\n• NUNCA guardas la contraseña en texto plano — la hasheas con bcrypt\n• Al hacer login, comparas la contraseña ingresada con el hash guardado\n• Si coinciden, generas un JWT token y se lo das\n\n2. AUTORIZACIÓN CON JWT:\n• JWT (JSON Web Token) es un token firmado que contiene datos del usuario\n• El cliente lo guarda y lo manda en cada petición protegida\n• Tu servidor verifica la firma y sabe quién es el usuario\n• Sin el token (o con uno inválido), la petición es rechazada\n\nbcrypt es una función de hash diseñada para ser LENTA (a propósito). Esto hace que sea muy difícil adivinar contraseñas aunque alguien robe tu base de datos.`,
          questions: [
            "¿Por qué guardar contraseñas en texto plano es tan peligroso? ¿Qué pasaría si hacen un hack a tu base de datos?",
            "¿Qué diferencia hay entre autenticación (¿quién eres?) y autorización (¿qué puedes hacer?)? Da un ejemplo de cada uno.",
            "JWT se puede decodificar sin la clave secreta, ¿es eso un problema de seguridad? ¿Qué información NO deberías poner en un JWT?"
          ],
          exercise: {
            title: "Sistema completo de registro, login y rutas protegidas",
            description: "Implementa registro con hash de contraseña, login que devuelve JWT, y un middleware que protege rutas.",
            steps: [
              "npm install bcrypt jsonwebtoken",
              "Añade JWT_SECRET al archivo .env",
              "Crea las rutas de autenticación",
              "Crea el middleware de autenticación",
              "Protege algunas rutas con el middleware",
              "Prueba el flujo completo con Insomnia"
            ],
            whatYouWillSee: "Podrás registrarte, recibir un token, y usar ese token para acceder a rutas protegidas.",
            code: `// .env — añade esto
JWT_SECRET=mi_clave_super_secreta_cambiame_en_produccion

// auth.js — rutas de autenticación
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
// (asume que tienes prisma configurado)

// POST /auth/registro
router.post('/registro', async (req, res) => {
  const { nombre, email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }
  
  // Hash de la contraseña — el '10' es el "costo" (más alto = más lento = más seguro)
  const passwordHash = await bcrypt.hash(password, 10);
  
  try {
    const usuario = await prisma.usuario.create({
      data: { nombre, email, passwordHash }
    });
    
    res.status(201).json({ mensaje: '¡Usuario creado!', id: usuario.id });
  } catch (error) {
    // El email ya existe (restricción UNIQUE en la DB)
    res.status(409).json({ error: 'El email ya está registrado' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  
  // IMPORTANTE: no decir si el email existe o no (seguridad)
  if (!usuario) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  
  const passwordValida = await bcrypt.compare(password, usuario.passwordHash);
  
  if (!passwordValida) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  
  // Generar el token JWT (expira en 7 días)
  const token = jwt.sign(
    { userId: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre } });
});

// middleware/autenticar.js — protege rutas
function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // Disponible en la siguiente función
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

// Uso del middleware — protege una ruta
app.get('/mi-perfil', autenticar, async (req, res) => {
  // req.usuario está disponible gracias al middleware
  const usuario = await prisma.usuario.findUnique({
    where: { id: req.usuario.userId }
  });
  res.json(usuario);
});`
          },
          concepts_box: [
            { term: "bcrypt", simple: "Algoritmo para hashear contraseñas. Es intencionalmente lento para dificultar ataques." },
            { term: "Hash", simple: "Transformación unidireccional. Puedes verificar si algo coincide con el hash, pero no revertirlo." },
            { term: "JWT", simple: "Token firmado que contiene datos del usuario. Como un DNI digital que no puedes falsificar." },
            { term: "Bearer Token", simple: "Forma de enviar el JWT: en el header 'Authorization: Bearer <token>'." },
            { term: "Middleware de autenticación", simple: "Función que verifica el JWT antes de ejecutar la lógica de la ruta." },
            { term: "401 vs 403", simple: "401 = no estás identificado. 403 = estás identificado pero no tienes permiso." }
          ],
          resources: [
            { title: "JWT.io — Decodifica y entiende los tokens visualmente", url: "https://jwt.io" },
            { title: "bcrypt — npm documentation", url: "https://www.npmjs.com/package/bcrypt" },
            { title: "OWASP — Guía de autenticación segura", url: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" }
          ]
        },
        {
          day: 9,
          emoji: "✅",
          title: "Validación y manejo de errores",
          subtitle: "Tu API siendo amable y robusta",
          analogy: "Una API sin validación es como un formulario de papel que acepta que escribas tu edad como 'patata'. La validación es el proceso de verificar que los datos tienen sentido antes de procesarlos. El manejo de errores es comunicar qué salió mal de forma clara y útil.",
          concept: `Dos responsabilidades que los principiantes suelen ignorar pero son cruciales en producción:\n\nVALIDACIÓN:\n• Verificar que los datos requeridos existen\n• Verificar que tienen el formato correcto (email real, número positivo, etc.)\n• Verificar que tienen sentido (edad entre 0 y 150, por ejemplo)\n• La librería Zod hace esto de forma elegante con TypeScript-like schemas\n\nMANEJO DE ERRORES:\n• Los errores son inevitables. La pregunta es cómo los manejas\n• Un error no manejado puede tirar abajo todo el servidor\n• Los errores deben devolver respuestas útiles al cliente (no stack traces)\n• Express tiene un manejador de errores global (4 parámetros)\n• Los errores de base de datos deben loguearse y traducirse a mensajes amigables`,
          questions: [
            "¿Qué pasa si en tu API de tareas alguien envía { titulo: 12345 } (un número) en lugar de un string? ¿Tu API actual lo maneja bien?",
            "¿Cuál es la diferencia entre errores de validación (400 Bad Request) y errores del servidor (500 Internal Server Error)? ¿Por qué es importante distinguirlos?",
            "¿Por qué es mala práctica devolver el mensaje de error exacto de la base de datos al cliente? ¿Qué información sensible podría exponer?"
          ],
          exercise: {
            title: "Agregar validación con Zod y un error handler global",
            description: "Instala Zod y agrega validación a tus endpoints. Implementa un error handler global de Express que captura todos los errores y devuelve respuestas consistentes.",
            steps: [
              "npm install zod",
              "Crea schemas de validación para tus rutas",
              "Crea el middleware de validación",
              "Crea el error handler global",
              "Prueba enviando datos inválidos"
            ],
            whatYouWillSee: "Tu API devolverá mensajes de error claros y útiles en lugar de crashear o devolver errores de base de datos confusos.",
            code: `// validation/schemas.js — Schemas de Zod
const { z } = require('zod');

const crearTareaSchema = z.object({
  titulo: z.string()
    .min(1, 'El título no puede estar vacío')
    .max(200, 'El título no puede tener más de 200 caracteres')
    .trim(), // elimina espacios al inicio y final
  
  prioridad: z.enum(['baja', 'media', 'alta'])
    .default('media'),
  
  fechaLimite: z.string()
    .datetime('Formato de fecha inválido')
    .optional() // No es requerido
});

const registroSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe tener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe tener al menos un número')
});

// middleware/validar.js — Middleware genérico de validación
function validar(schema) {
  return (req, res, next) => {
    const resultado = schema.safeParse(req.body);
    
    if (!resultado.success) {
      // Zod nos da errores detallados por campo
      const errores = resultado.error.errors.map(e => ({
        campo: e.path.join('.'),
        mensaje: e.message
      }));
      
      return res.status(400).json({ 
        error: 'Datos inválidos', 
        detalles: errores 
      });
    }
    
    req.body = resultado.data; // Datos limpios y validados
    next();
  };
}

// Uso en rutas
app.post('/tareas', validar(crearTareaSchema), async (req, res) => {
  // Si llegamos aquí, req.body ya está validado ✅
  const tarea = await prisma.tarea.create({ data: req.body });
  res.status(201).json(tarea);
});

// Error handler global — va AL FINAL de todos los app.use()
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err); // Loguear para debugging
  
  // Errores conocidos de Prisma
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Ya existe un registro con ese valor único' });
  }
  
  // Error genérico (no revelar detalles internos)
  res.status(500).json({ 
    error: 'Algo salió mal en el servidor',
    // En desarrollo puedes mostrar más info:
    ...(process.env.NODE_ENV === 'development' && { detalles: err.message })
  });
});`
          },
          concepts_box: [
            { term: "Validación", simple: "Verificar que los datos de entrada tienen el formato y valores correctos antes de procesarlos." },
            { term: "Zod", simple: "Librería para definir y validar la 'forma' de tus datos con mensajes de error útiles." },
            { term: "Schema", simple: "La definición de qué campos esperas y qué reglas deben cumplir." },
            { term: "400 Bad Request", simple: "El cliente mandó algo mal formado o inválido. Es su culpa, no del servidor." },
            { term: "500 Internal Server Error", simple: "Algo explotó en el servidor. No es culpa del cliente." },
            { term: "Error handler global", simple: "Middleware especial en Express (4 parámetros) que captura todos los errores no manejados." }
          ],
          resources: [
            { title: "Zod — Documentación oficial", url: "https://zod.dev" },
            { title: "Express Error Handling — Guía oficial", url: "https://expressjs.com/es/guide/error-handling.html" },
            { title: "HTTP Status Codes — Cuándo usar cada uno", url: "https://httpstatuses.io" }
          ]
        },
        {
          day: 10,
          emoji: "🚀",
          title: "Deploy: publicar tu app al mundo",
          subtitle: "De localhost a Internet en un día",
          analogy: "Hacer deploy es como abrir tu restaurante al público. Hasta ahora solo cocinabas para ti (localhost). Ahora lo pones en una dirección real para que cualquier persona en el mundo pueda visitarlo. Hoy publicarás tu API de verdad.",
          concept: `Hasta ahora todo vivía en tu computadora. Para que el mundo acceda a tu app necesitas:\n\n1. Un SERVIDOR EN LA NUBE — una computadora que esté prendida 24/7 con una IP pública\n2. Tus VARIABLES DE ENTORNO configuradas en ese servidor\n3. Tu código subido a GitHub y luego al servidor\n\nPlataformas de deploy para principiantes:\n\n• Railway — La más sencilla. Conectas tu GitHub, Railway detecta Node.js y despliega automáticamente. Tiene plan gratuito.\n• Render — Similar a Railway, muy amigable para principiantes.\n• Vercel — Excelente para frontend, también soporta APIs (funciones serverless)\n\nProceso general:\n1. Subir código a GitHub\n2. Conectar el repositorio a Railway/Render\n3. Configurar variables de entorno en el dashboard\n4. El servicio detecta el lenguaje, instala dependencias y corre tu app`,
          questions: [
            "¿Cuál es la diferencia entre 'localhost' y una URL pública como 'mi-api.railway.app'? ¿Qué cambios técnicos ocurren cuando haces deploy?",
            "Si tu app usa process.env.DATABASE_URL, ¿qué tienes que hacer en Railway/Render para que funcione correctamente?",
            "¿Qué crees que pasa cuando tu aplicación en Railway recibe más tráfico del que puede manejar? ¿Cómo se escala?"
          ],
          exercise: {
            title: "Deploy de tu API a Railway",
            description: "Sube tu proyecto de blog/tareas a GitHub y haz deploy en Railway. Al final, tendrás una URL pública que funciona desde cualquier dispositivo del mundo.",
            steps: [
              "Asegúrate de tener .gitignore con .env y node_modules",
              "Añade un script 'start' en package.json",
              "Crea una cuenta en railway.app",
              "Conecta tu cuenta de GitHub",
              "Selecciona el repositorio de tu API",
              "Configura las variables de entorno en el dashboard de Railway",
              "Railway desplegará automáticamente — espera el deployment"
            ],
            whatYouWillSee: "Una URL pública (ej: mi-api-production.up.railway.app) donde tu API funciona para todo el mundo.",
            code: `// package.json — añade estos scripts
{
  "name": "mi-api",
  "version": "1.0.0",
  "scripts": {
    "start": "node app.js",          // Este es el comando que Railway usa
    "dev": "nodemon app.js",         // Este es para desarrollo local
    "db:push": "prisma db push",     // Para aplicar el schema a la DB
    "db:studio": "prisma studio"     // UI visual para ver tu base de datos
  },
  "engines": {
    "node": ">=18.0.0"  // Le dice a Railway qué versión de Node usar
  }
}

// Procfile (opcional, para algunas plataformas)
web: node app.js

// Variables de entorno en Railway:
// DATABASE_URL = (la connection string de tu Supabase)
// JWT_SECRET   = (una clave larga y aleatoria)
// NODE_ENV     = production
// PORT         = (Railway lo pone automáticamente)

// CHECKLIST ANTES DE HACER DEPLOY:
// ✅ .gitignore tiene: .env, node_modules/, *.db
// ✅ package.json tiene "start" script
// ✅ No hay contraseñas hardcodeadas en el código
// ✅ La app usa process.env.PORT (Railway asigna el puerto)
// ✅ prisma generate se corre en el build (o en postinstall)`
          },
          concepts_box: [
            { term: "Deploy", simple: "El proceso de subir y poner en marcha tu aplicación en un servidor real en Internet." },
            { term: "Railway", simple: "Plataforma en la nube que despliega tu app automáticamente desde GitHub." },
            { term: "Producción", simple: "El entorno real donde los usuarios usan tu app. Opuesto a 'desarrollo' (tu laptop)." },
            { term: "CI/CD", simple: "Integración Continua / Despliegue Continuo. Cada push a GitHub puede deployar automáticamente." },
            { term: "Logs", simple: "Los console.log de tu app en producción. Railway te los muestra en tiempo real." },
            { term: "Escalar", simple: "Añadir más recursos (CPU, RAM) o más instancias de tu app para manejar más tráfico." }
          ],
          resources: [
            { title: "Railway — Getting Started", url: "https://docs.railway.app/getting-started" },
            { title: "Render — Deploy a Node.js app", url: "https://render.com/docs/node-express-app" },
            { title: "Git y GitHub en 20 minutos — video tutorial", url: "https://www.youtube.com/watch?v=VdGzPodjSAk" }
          ]
        }
      ]
    },
    {
      id: 3,
      emoji: "⚡",
      title: "APIs Avanzadas y Buenas Prácticas",
      tagline: "Escribir código de calidad profesional",
      color: "#8B5CF6",
      light: "#FAF5FF",
      border: "#DDD6FE",
      days: [
        {
          day: 11,
          emoji: "📁",
          title: "Estructura de proyecto y separación de responsabilidades",
          subtitle: "Organizar el código para que crezca sin volverse un caos",
          analogy: "Un proyecto sin estructura es como una cocina donde los ingredientes, los utensilios y los platos limpios están todos mezclados en el mismo cajón. Funciona cuando eres el único cocinero y hay 5 platos. Pero si tienes 50 platos y 3 cocineros, necesitas organización.",
          concept: `La arquitectura más común para APIs de Node.js sigue el patrón en capas:\n\n📁 routes/ — Define qué URLs existen y qué función llaman\n📁 controllers/ — La lógica de cada endpoint (qué hace con el request)\n📁 services/ — La lógica de negocio (reglas de la app, sin saber de HTTP)\n📁 middleware/ — Funciones que se ejecutan antes de los controllers\n📁 prisma/ — Configuración y schema de la base de datos\n\nPor qué esta separación:\n• Las rutas solo saben de URLs y métodos HTTP\n• Los controllers solo saben de HTTP (req, res)\n• Los services no saben nada de HTTP — pueden reutilizarse desde tests, cron jobs, etc.\n• Si cambias de Express a Fastify, solo reescribes routes y controllers\n\nEsta separación se llama 'Separación de Responsabilidades' o SoC (Separation of Concerns).`,
          questions: [
            "¿Por qué es importante que la lógica de negocio (services) no sepa nada sobre HTTP? ¿Qué ventajas concretas tiene eso?",
            "Tienes un endpoint que: valida la entrada, verifica que el usuario sea admin, crea un post en la DB y envía un email de notificación. ¿Dónde va cada parte?",
            "¿Cuál es el problema de tener toda la lógica directamente en el archivo app.js? ¿Cuándo empieza a ser un problema?"
          ],
          exercise: {
            title: "Refactorizar la API del blog con arquitectura en capas",
            description: "Reorganiza el proyecto del blog siguiendo la estructura de capas. Todo debe funcionar igual que antes, pero el código estará organizado.",
            steps: [
              "Crea la estructura de carpetas descrita abajo",
              "Mueve las rutas a routes/posts.js",
              "Crea controllers/postsController.js",
              "Crea services/postsService.js con la lógica de DB",
              "Actualiza app.js para que solo monte las rutas",
              "Prueba que todo sigue funcionando"
            ],
            whatYouWillSee: "El mismo comportamiento que antes, pero el código está separado en responsabilidades claras. Añadir nuevas funcionalidades será mucho más fácil.",
            code: `// Estructura de archivos recomendada
mi-api/
├── app.js                 // Punto de entrada, config de Express
├── .env
├── package.json
├── prisma/
│   └── schema.prisma
├── routes/
│   ├── index.js           // Monta todas las rutas
│   ├── posts.js
│   ├── usuarios.js
│   └── auth.js
├── controllers/
│   ├── postsController.js
│   └── usuariosController.js
├── services/
│   ├── postsService.js    // Lógica con Prisma
│   └── authService.js
├── middleware/
│   ├── autenticar.js
│   └── validar.js
└── validation/
    └── schemas.js

// routes/posts.js
const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const { autenticar } = require('../middleware/autenticar');
const { validar } = require('../middleware/validar');
const { crearPostSchema } = require('../validation/schemas');

router.get('/', postsController.listar);
router.get('/:id', postsController.obtener);
router.post('/', autenticar, validar(crearPostSchema), postsController.crear);
router.delete('/:id', autenticar, postsController.eliminar);

module.exports = router;

// controllers/postsController.js
const postsService = require('../services/postsService');

const listar = async (req, res, next) => {
  try {
    const posts = await postsService.obtenerPublicados();
    res.json(posts);
  } catch (err) {
    next(err); // Pasa el error al error handler global
  }
};

const crear = async (req, res, next) => {
  try {
    const post = await postsService.crear(req.body, req.usuario.userId);
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

module.exports = { listar, crear /*, obtener, eliminar */ };

// services/postsService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ¡Este archivo no sabe nada de req ni res!
const obtenerPublicados = async () => {
  return prisma.post.findMany({
    where: { publicado: true },
    include: { usuario: { select: { nombre: true } } },
    orderBy: { creadoEn: 'desc' }
  });
};

const crear = async (datos, usuarioId) => {
  return prisma.post.create({
    data: { ...datos, usuarioId }
  });
};

module.exports = { obtenerPublicados, crear };`
          },
          concepts_box: [
            { term: "Separación de responsabilidades", simple: "Cada parte del código tiene una sola razón para cambiar. Rutas solo rutas, lógica solo lógica." },
            { term: "Controller", simple: "Maneja la petición HTTP, llama al servicio y devuelve la respuesta." },
            { term: "Service", simple: "Contiene la lógica de negocio. No sabe de HTTP. Puede ser llamado desde cualquier parte." },
            { term: "Router", simple: "En Express, un mini-app que agrupa rutas relacionadas." },
            { term: "next(err)", simple: "Pasa un error al siguiente middleware (el error handler global)." },
            { term: "Arquitectura en capas", simple: "Organización del código en capas con responsabilidades claras: rutas → controllers → services → DB." }
          ],
          resources: [
            { title: "Express Best Practices — Estructura de proyecto", url: "https://expressjs.com/es/advanced/best-practice-performance.html" },
            { title: "Node.js Best Practices — goldbergyoni/nodebestpractices (GitHub)", url: "https://github.com/goldbergyoni/nodebestpractices" }
          ]
        },
        {
          day: 12,
          emoji: "🧪",
          title: "Testing: probar que tu código funciona",
          subtitle: "Tests automáticos para tener confianza al cambiar código",
          analogy: "Los tests son como tener un asistente que prueba tu app automáticamente cada vez que cambias algo. Sin tests, cada vez que cambias código tienes que probar manualmente que todo sigue funcionando. Con tests, la computadora lo hace por ti en segundos.",
          concept: `Tipos de tests de más rápidos a más lentos:\n\n🏃 Unit tests — prueban una función aislada. Son rapidísimos.\n🔗 Integration tests — prueban que varias partes funcionan juntas (tu endpoint + la base de datos).\n🌐 E2E (End-to-End) tests — simulan un usuario real usando la aplicación.\n\nPara empezar, los integration tests de APIs son los más valiosos por su relación esfuerzo/beneficio:\n• Con Supertest, puedes hacer peticiones reales a tu API en tests\n• Jest es el framework de testing más popular en el ecosistema Node.js\n• La idea: describes qué debería pasar, corres el test, Jest verifica\n\nBeneficio clave: cuando refactorizas código (lo reorganizas sin cambiar su comportamiento), los tests te garantizan que no rompiste nada.`,
          questions: [
            "Si los tests toman tiempo de escribir, ¿por qué vale la pena hacerlos? ¿Cuándo NO valdría la pena?",
            "¿Qué problema hay con usar la base de datos de producción en los tests? ¿Cómo lo resolverías?",
            "¿Qué significa que un test es 'determinístico'? ¿Por qué es importante que los tests siempre den el mismo resultado?"
          ],
          exercise: {
            title: "Integration tests para la API de tareas",
            description: "Escribe tests que prueben los endpoints de tu API usando Jest y Supertest.",
            steps: [
              "npm install -D jest supertest",
              "Añade 'test': 'jest' en package.json scripts",
              "Configura una DB de test separada",
              "Crea el archivo de tests",
              "Corre: npm test"
            ],
            whatYouWillSee: "Jest ejecutará los tests y te dirá cuántos pasaron y cuántos fallaron, con mensajes claros.",
            code: `// tests/tareas.test.js
const request = require('supertest');
const app = require('../app'); // Importa tu app de Express

// Limpiar la DB antes de cada test para tener estado limpio
beforeEach(async () => {
  await prisma.tarea.deleteMany();
});

// Cerrar la conexión después de todos los tests
afterAll(async () => {
  await prisma.$disconnect();
});

// describe agrupa tests relacionados
describe('GET /tareas', () => {
  
  it('devuelve una lista vacía cuando no hay tareas', async () => {
    const respuesta = await request(app).get('/tareas');
    
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual([]); // Lista vacía
  });
  
  it('devuelve las tareas existentes', async () => {
    // Crear tareas directamente en la DB
    await prisma.tarea.createMany({
      data: [
        { titulo: 'Tarea 1' },
        { titulo: 'Tarea 2' }
      ]
    });
    
    const respuesta = await request(app).get('/tareas');
    
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toHaveLength(2);
    expect(respuesta.body[0]).toHaveProperty('titulo', 'Tarea 1');
  });
});

describe('POST /tareas', () => {
  
  it('crea una tarea y devuelve 201', async () => {
    const respuesta = await request(app)
      .post('/tareas')
      .send({ titulo: 'Mi nueva tarea' });
    
    expect(respuesta.status).toBe(201);
    expect(respuesta.body).toMatchObject({
      titulo: 'Mi nueva tarea',
      completada: false
    });
    expect(respuesta.body.id).toBeDefined();
  });
  
  it('devuelve 400 si no hay titulo', async () => {
    const respuesta = await request(app)
      .post('/tareas')
      .send({}); // Sin título
    
    expect(respuesta.status).toBe(400);
    expect(respuesta.body.error).toBeDefined();
  });
});`
          },
          concepts_box: [
            { term: "Jest", simple: "Framework de testing de JavaScript. Corre tus tests y verifica que los resultados sean los esperados." },
            { term: "Supertest", simple: "Librería para hacer peticiones HTTP a tu app Express en tests, sin necesitar el puerto real." },
            { term: "describe()", simple: "Agrupa tests relacionados bajo un nombre descriptivo." },
            { term: "it() / test()", simple: "Define un test individual. El string describe qué debería pasar." },
            { term: "expect()", simple: "Hace una afirmación: 'espero que esto sea igual a aquello'." },
            { term: "beforeEach()", simple: "Función que se ejecuta antes de cada test. Útil para resetear el estado." }
          ],
          resources: [
            { title: "Jest — Documentación oficial en español", url: "https://jestjs.io/es-ES/docs/getting-started" },
            { title: "Supertest — GitHub", url: "https://github.com/ladjs/supertest" },
            { title: "Testing Node.js — guía completa freeCodeCamp", url: "https://www.freecodecamp.org/news/how-to-test-in-express-and-mongoose" }
          ]
        },
        {
          day: 13,
          emoji: "📄",
          title: "Documentar tu API con Swagger",
          subtitle: "Que otros (y tú en 6 meses) entiendan tu API",
          analogy: "Una API sin documentación es como un control remoto sin manual y sin etiquetas en los botones. Funciona si tú la hiciste, pero nadie más sabe usarla. Swagger genera documentación interactiva automáticamente a partir de tu código.",
          concept: `La documentación de API más común en la industria usa el estándar OpenAPI (antes llamado Swagger).\n\nCon swagger-ui-express y swagger-jsdoc puedes:\n• Escribir la documentación en comentarios de tu código (en formato YAML/JSDoc)\n• Swagger genera automáticamente una página web interactiva\n• Los usuarios pueden probar los endpoints directamente desde la documentación\n• Es el estándar que usan empresas como Stripe, Twilio, GitHub, etc.\n\nVer la documentación de Stripe (stripe.com/docs/api) es inspirador — ese es el nivel al que aspiras.\n\nAlternativa moderna: Hono + Zod-OpenAPI genera la documentación automáticamente desde tus schemas de validación. Muy popular en 2024-2025.`,
          questions: [
            "¿Por qué la documentación de una API es tan importante cuando trabajas en equipo o tienes clientes que consumen tu API?",
            "Si cambias tu API (añades un campo, cambias un nombre), ¿qué le pasa a quienes ya estaban usando la versión anterior? ¿Cómo lo manejarías?",
            "¿Cuál es la diferencia entre documentar el 'qué hace' un endpoint vs. el 'cómo funciona internamente'? ¿Qué es más importante para los consumidores de la API?"
          ],
          exercise: {
            title: "Swagger UI para tu API de blog",
            description: "Agrega documentación Swagger a tu API. Al final, tendrás una página en /api-docs con todos tus endpoints documentados e interactivos.",
            steps: [
              "npm install swagger-ui-express swagger-jsdoc",
              "Crea el archivo de configuración de Swagger",
              "Añade comentarios JSDoc a tus rutas",
              "Monta la UI en app.js",
              "Visita http://localhost:3000/api-docs"
            ],
            whatYouWillSee: "Una página web interactiva con todos tus endpoints, donde puedes hacer peticiones de prueba directamente desde el navegador.",
            code: `// swagger.js — Configuración
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Blog',
      version: '1.0.0',
      description: 'API REST para gestionar posts y usuarios',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Desarrollo' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Archivos donde buscar comentarios de Swagger
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };

// routes/posts.js — Con comentarios Swagger
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Obtiene todos los posts publicados
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *     responses:
 *       200:
 *         description: Lista de posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get('/', postsController.listar);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Crea un nuevo post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo, contenido]
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Mi primer post
 *               contenido:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post creado exitosamente
 *       401:
 *         description: Token requerido
 */
router.post('/', autenticar, postsController.crear);

// app.js — Montar Swagger
const { swaggerUi, specs } = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));`
          },
          concepts_box: [
            { term: "OpenAPI / Swagger", simple: "Estándar para describir APIs REST. Genera documentación interactiva automáticamente." },
            { term: "swagger-ui-express", simple: "Sirve la página web de Swagger UI desde tu servidor Express." },
            { term: "JSDoc", simple: "Comentarios especiales en el código que documentan funciones, parámetros y respuestas." },
            { term: "Schema de respuesta", simple: "La definición de qué estructura tiene la respuesta de un endpoint." },
            { term: "Tags", simple: "Agrupan endpoints relacionados en la documentación. Ej: Posts, Usuarios, Auth." },
            { term: "Versioning de API", simple: "Indicar la versión (/v1/posts, /v2/posts) para no romper clientes existentes al cambiar." }
          ],
          resources: [
            { title: "Swagger UI — Documentación oficial", url: "https://swagger.io/docs/open-source-tools/swagger-ui" },
            { title: "OpenAPI Specification — Aprende el estándar", url: "https://spec.openapis.org/oas/latest.html" },
            { title: "Stripe API Docs — El gold standard de documentación", url: "https://stripe.com/docs/api" }
          ]
        },
        {
          day: 14,
          emoji: "🌊",
          title: "Upload de archivos e imágenes",
          subtitle: "Subir fotos de perfil, documentos y más",
          analogy: "Subir un archivo a un servidor es como enviar un paquete por correo en lugar de una carta. En lugar de texto, estás enviando datos binarios (bytes). El servidor necesita 'abrir el paquete', guardar su contenido y darte una dirección donde encontrarlo.",
          concept: `El manejo de archivos es una necesidad común: fotos de perfil, PDFs, imágenes de productos.\n\nHay dos opciones principales:\n\n📁 Guardar en el servidor local — Simple pero no escala. Si tienes múltiples servidores, el archivo solo está en uno. Problema al hacer deploy.\n\n☁️ Guardar en la nube (Cloudinary, AWS S3, Supabase Storage) — La forma correcta para producción. El archivo va a un servicio especializado y tú guardas solo la URL en tu base de datos.\n\nMulter es la librería más popular para manejar el upload en Express. Se usa como middleware y te da acceso al archivo antes de que decidas qué hacer con él.\n\nPara aprender, Cloudinary tiene un plan gratuito generoso y es muy fácil de integrar.`,
          questions: [
            "Si guardas los archivos en el servidor local y luego haces deploy en Railway (que puede reiniciar tu servidor), ¿qué le pasaría a los archivos subidos?",
            "¿Qué validaciones harías antes de aceptar un archivo? ¿Qué peligros existen si no validas el tipo o el tamaño?",
            "¿Por qué guardas la URL de la imagen en la base de datos en lugar de la imagen en sí misma? ¿Cuándo podría tener sentido guardar la imagen en la DB?"
          ],
          exercise: {
            title: "Upload de avatar con Cloudinary",
            description: "Agrega un endpoint para subir fotos de perfil. El archivo se sube a Cloudinary y la URL se guarda en la base de datos.",
            steps: [
              "Crea una cuenta gratuita en cloudinary.com",
              "Copia CLOUDINARY_URL al .env",
              "npm install multer cloudinary multer-storage-cloudinary",
              "Crea el endpoint de upload",
              "Prueba subiendo una imagen desde Insomnia"
            ],
            whatYouWillSee: "Al subir una imagen, recibirás una URL de Cloudinary. La imagen será accesible desde cualquier navegador del mundo.",
            code: `// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL // Configura automáticamente
});

// Configura dónde y cómo se guardan los archivos
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'avatares',          // Carpeta en Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 400, height: 400, crop: 'fill' } // Redimensionar automáticamente
    ]
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Máximo 5MB
});

module.exports = upload;

// routes/usuarios.js
const upload = require('../config/cloudinary');

// POST /usuarios/avatar — subir foto de perfil
router.post(
  '/avatar',
  autenticar,
  upload.single('avatar'), // 'avatar' es el nombre del campo en el form
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No se envió ningún archivo' });
      }
      
      // req.file.path es la URL de Cloudinary
      const usuario = await prisma.usuario.update({
        where: { id: req.usuario.userId },
        data: { avatarUrl: req.file.path }
      });
      
      res.json({ 
        mensaje: 'Avatar actualizado',
        avatarUrl: usuario.avatarUrl 
      });
    } catch (err) {
      next(err);
    }
  }
);

// Para testear con curl:
// curl -X POST http://localhost:3000/usuarios/avatar \\
//   -H "Authorization: Bearer TU_TOKEN" \\
//   -F "avatar=@/ruta/a/tu/imagen.jpg"`
          },
          concepts_box: [
            { term: "Multer", simple: "Middleware de Express para manejar archivos en las peticiones (multipart/form-data)." },
            { term: "multipart/form-data", simple: "El Content-Type especial que se usa para enviar archivos (en lugar de application/json)." },
            { term: "Cloudinary", simple: "Servicio en la nube para almacenar y transformar imágenes y videos." },
            { term: "CDN", simple: "Content Delivery Network. Sirve archivos desde servidores cercanos al usuario para ser más rápido." },
            { term: "Transformaciones", simple: "Cloudinary puede redimensionar, recortar o convertir imágenes automáticamente al subirlas." },
            { term: "S3", simple: "Amazon S3 — el servicio de almacenamiento de archivos más usado en producción." }
          ],
          resources: [
            { title: "Cloudinary — Getting Started", url: "https://cloudinary.com/documentation/node_quickstart" },
            { title: "Multer — npm documentation", url: "https://www.npmjs.com/package/multer" },
            { title: "Supabase Storage — alternativa gratuita", url: "https://supabase.com/docs/guides/storage" }
          ]
        },
        {
          day: 15,
          emoji: "🎯",
          title: "Proyecto integrador: Red social mini",
          subtitle: "Conectar todo lo aprendido en un proyecto real",
          analogy: "Es hora de construir algo de verdad. Como las semanas de entrenamiento que terminan con un partido real — este día es el partido. Vas a crear una mini red social con todo lo que aprendiste.",
          concept: `El mejor aprendizaje es construir proyectos reales. Hoy integras todo:\n\n• Base de datos con relaciones (usuarios, posts, likes, follows)\n• Autenticación con JWT\n• Subida de imágenes (avatar)\n• Validación de datos\n• Manejo de errores\n• Arquitectura en capas (routes/controllers/services)\n• Tests básicos\n• Deploy en Railway\n\nNo tiene que ser perfecto. El objetivo es ver cómo todas las piezas encajan juntas y enfrentarte a los problemas que surgen cuando construyes algo completo.\n\nDespués de este proyecto, tendrás algo que mostrar en entrevistas y en tu portfolio.`,
          questions: [
            "Antes de escribir una línea de código, ¿qué tablas necesitas y qué relaciones tienen entre ellas? Dibuja el diagrama en papel.",
            "¿Cuál es el orden lógico para implementar las features? ¿Por qué debería la autenticación ir antes que la lógica de posts?",
            "¿Qué feature dejarías para después si tuvieras 4 horas para hacer un MVP funcional? Prioriza."
          ],
          exercise: {
            title: "Mini red social — Backend completo",
            description: "Construye el backend completo de una mini red social con las features listadas abajo. No hay código guía esta vez — usa todo lo aprendido.",
            steps: [
              "Diseña el schema de Prisma (usuarios, posts, follows, likes)",
              "Implementa autenticación (registro/login)",
              "Implementa CRUD de posts con imágenes",
              "Implementa follows (seguir/dejar de seguir usuarios)",
              "Implementa likes en posts",
              "Crea el endpoint de feed (posts de usuarios que sigues)",
              "Documenta con Swagger",
              "Haz deploy en Railway"
            ],
            whatYouWillSee: "Una API completa y desplegada que puedes mostrar en tu portfolio. El mismo tipo de backend que usan las redes sociales reales, en miniatura.",
            code: `// prisma/schema.prisma — Schema completo
model Usuario {
  id          Int       @id @default(autoincrement())
  nombre      String
  email       String    @unique
  passwordHash String
  avatarUrl   String?
  bio         String?
  creadoEn    DateTime  @default(now())
  
  posts       Post[]
  likes       Like[]
  seguidores  Follow[]  @relation("seguidores")
  seguidos    Follow[]  @relation("seguidos")
}

model Post {
  id        Int      @id @default(autoincrement())
  contenido String
  imagenUrl String?
  creadoEn  DateTime @default(now())
  
  usuario   Usuario  @relation(fields: [usuarioId], references: [id])
  usuarioId Int
  likes     Like[]
}

model Like {
  id        Int      @id @default(autoincrement())
  usuario   Usuario  @relation(fields: [usuarioId], references: [id])
  usuarioId Int
  post      Post     @relation(fields: [postId], references: [id])
  postId    Int
  
  @@unique([usuarioId, postId]) // Un usuario solo puede dar like una vez
}

model Follow {
  id          Int      @id @default(autoincrement())
  seguidor    Usuario  @relation("seguidores", fields: [seguidorId], references: [id])
  seguidorId  Int
  seguido     Usuario  @relation("seguidos", fields: [seguidoId], references: [id])
  seguidoId   Int
  creadoEn    DateTime @default(now())
  
  @@unique([seguidorId, seguidoId])
}

// Endpoints que debes implementar:
// POST   /auth/registro         → Registrar usuario
// POST   /auth/login            → Login, devuelve JWT
// GET    /usuarios/:id          → Ver perfil de usuario
// POST   /posts                 → Crear post (con imagen opcional)
// DELETE /posts/:id             → Eliminar post (solo el dueño)
// POST   /posts/:id/like        → Dar like
// DELETE /posts/:id/like        → Quitar like
// POST   /usuarios/:id/follow   → Seguir usuario
// DELETE /usuarios/:id/follow   → Dejar de seguir
// GET    /feed                  → Posts de usuarios que sigo`
          },
          concepts_box: [
            { term: "MVP", simple: "Minimum Viable Product. La versión más simple que funciona. Construye esto primero." },
            { term: "Schema de base de datos", simple: "El diseño de tus tablas y relaciones. Es lo más importante — un mal diseño es muy costoso de cambiar." },
            { term: "Relación many-to-many", simple: "Muchos usuarios pueden seguir a muchos usuarios. Se necesita tabla intermedia (Follow)." },
            { term: "Constraint UNIQUE compuesto", simple: "@@unique([userId, postId]) — la combinación de ambos campos debe ser única. Evita likes duplicados." },
            { term: "Feed algorítmico", simple: "Los posts mostrados se seleccionan por un criterio (cronológico, relevancia). Empieza con el más simple: cronológico." },
            { term: "Portfolio", simple: "Tu colección de proyectos que muestras en entrevistas. Este proyecto debería estar ahí." }
          ],
          resources: [
            { title: "GitHub — Crea un repositorio y sube tu proyecto", url: "https://github.com" },
            { title: "Railway — Despliega tu proyecto", url: "https://railway.app" },
            { title: "Readme.so — Crea un README profesional para tu proyecto", url: "https://readme.so/es" }
          ]
        }
      ]
    },
    {
      id: 4,
      emoji: "🌟",
      title: "Full Stack: Conectar Frontend y Backend",
      tagline: "Ver la imagen completa y los próximos pasos",
      color: "#10B981",
      light: "#ECFDF5",
      border: "#A7F3D0",
      days: [
        {
          day: 16,
          emoji: "⚛️",
          title: "Conectar React con tu API",
          subtitle: "El frontend habla con el backend que construiste",
          analogy: "Hasta ahora construiste la cocina del restaurante. Hoy construyes el comedor — la parte que los clientes ven. React es el comedor, tu API Express es la cocina. El mozo (fetch/axios) lleva los pedidos de un lado a otro.",
          concept: `Una aplicación full stack tiene:\n• FRONTEND (React, Vue, etc.) — Lo que el usuario ve en el navegador. Hace peticiones al backend.\n• BACKEND (Express + Node.js) — Tu API. Recibe peticiones, procesa y devuelve datos.\n\nLa comunicación es siempre HTTP: el frontend hace fetch() o usa axios para llamar a tu API.\n\nPuntos clave para la integración:\n• CORS: tu API necesita permitir peticiones del dominio del frontend\n• Manejo de tokens: el token JWT se guarda en el frontend y se manda en cada petición protegida\n• Estado global: en React, puedes usar Context API o Zustand para guardar el usuario logueado\n• Gestión de errores: el frontend necesita manejar cuando la API devuelve 401, 404, 500\n\nAxios es una librería popular que hace más fácil hacer peticiones HTTP y manejar errores.`,
          questions: [
            "¿Dónde guarda el token JWT el frontend? ¿localStorage, sessionStorage, o cookies? ¿Cuáles son los pros y contras de cada opción?",
            "Si el token expira mientras el usuario está usando la app, ¿qué debería pasar? ¿Cómo lo manejarías en el frontend?",
            "¿Qué diferencia hay entre hacer el fetch directo en un componente de React vs. crear un 'servicio' de API separado? ¿Cuál escala mejor?"
          ],
          exercise: {
            title: "Frontend React para tu mini red social",
            description: "Crea una app React que consuma tu API. Implementa login, ver el feed, y crear posts.",
            steps: [
              "npm create vite@latest frontend -- --template react",
              "cd frontend && npm install axios",
              "Crea el servicio de API (api.js)",
              "Crea el contexto de autenticación",
              "Crea las páginas: Login, Feed, CrearPost",
              "Conecta con tu API desplegada en Railway"
            ],
            whatYouWillSee: "Una app web completa que funciona — el usuario puede loguearse, ver posts y crear nuevos. Full stack de verdad.",
            code: `// src/services/api.js — Servicio centralizado para la API
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000'
});

// Interceptor: añade el token JWT automáticamente a cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// Interceptor: si recibe 401, redirige al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  registro: (datos) => api.post('/auth/registro', datos),
};

export const postsService = {
  getFeed: () => api.get('/feed'),
  crear: (datos) => api.post('/posts', datos),
  darLike: (id) => api.post(\`/posts/\${id}/like\`),
};

// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  const login = async (email, password) => {
    const { data } = await authService.login(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);`
          },
          concepts_box: [
            { term: "Axios", simple: "Librería para hacer peticiones HTTP. Más funcional que fetch() nativo con interceptors, cancelación, etc." },
            { term: "Interceptor", simple: "Función que se ejecuta antes o después de cada petición/respuesta de Axios. Perfecta para el token JWT." },
            { term: "Context API", simple: "Sistema de React para compartir estado (como el usuario logueado) entre componentes sin pasar props." },
            { term: "VITE_API_URL", simple: "Variable de entorno en el frontend. En Vite, las variables de env empiezan con VITE_." },
            { term: "Vite", simple: "Herramienta moderna para crear proyectos React. Más rápida que Create React App." },
            { term: "Full Stack", simple: "Desarrollador/aplicación que maneja tanto el frontend como el backend." }
          ],
          resources: [
            { title: "Axios — Documentación oficial", url: "https://axios-http.com/es/docs/intro" },
            { title: "Vite — Getting Started", url: "https://vitejs.dev/guide" },
            { title: "React Context API — Documentación oficial", url: "https://react.dev/learn/passing-data-deeply-with-context" }
          ]
        },
        {
          day: 17,
          emoji: "🔄",
          title: "Estado, caché y React Query",
          subtitle: "Manejar datos del servidor de forma inteligente",
          analogy: "Cada vez que navegas a una página que ya visitaste, ¿tu app debería volver a pedir los datos al servidor? A veces sí (datos que cambian mucho), a veces no (datos que cambian poco). React Query maneja esto por ti automáticamente — es como tener un asistente inteligente que sabe cuándo buscar datos frescos.",
          concept: `Manejar el estado del servidor en el frontend tiene retos:\n• ¿Cuándo recargar los datos?\n• ¿Cómo mostrar loading y errores?\n• ¿Cómo sincronizar datos entre componentes?\n• ¿Cómo optimizar para no hacer peticiones innecesarias?\n\nReact Query (ahora TanStack Query) resuelve todos estos problemas con un enfoque declarativo:\n• useQuery() — para GET requests. Cachea, recarga automáticamente, maneja loading/error.\n• useMutation() — para POST/PUT/DELETE. Invalida el caché cuando necesitas datos frescos.\n\nAdemás de React Query, aprenderás hoy el concepto de optimistic updates: actualizar la UI inmediatamente (como si la petición ya tuvo éxito) para dar sensación de rapidez, y revertir si falla.`,
          questions: [
            "¿Por qué el caché del lado del cliente (React Query) es diferente del caché del servidor (Redis)? ¿Cada uno resuelve qué problema?",
            "¿Cuál es el riesgo de los 'optimistic updates'? ¿Qué pasa si el servidor rechaza la operación después de que ya actualizaste la UI?",
            "Si tienes 5 componentes en la misma página que necesitan los datos del usuario logueado, ¿cuántas peticiones se hacen al servidor con React Query? ¿Por qué?"
          ],
          exercise: {
            title: "Refactorizar el Feed con React Query",
            description: "Reemplaza los useState/useEffect manuales por React Query para el feed de posts y la mutación de likes.",
            steps: [
              "npm install @tanstack/react-query",
              "Envuelve tu app con QueryClientProvider",
              "Reemplaza el useEffect del feed con useQuery",
              "Reemplaza el handler de like con useMutation",
              "Configura la invalidación del caché al dar like"
            ],
            whatYouWillSee: "El feed se recarga automáticamente, el loading state funciona sin esfuerzo, y los likes se actualizan en tiempo real.",
            code: `// main.jsx — Configurar React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,  // Datos "frescos" por 1 minuto
      retry: 1,              // Reintentar solo 1 vez en error
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </QueryClientProvider>
  );
}

// components/Feed.jsx — Con React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsService } from '../services/api';

function Feed() {
  const queryClient = useQueryClient();
  
  // useQuery — maneja loading, error y caché automáticamente
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['feed'],           // Clave única para el caché
    queryFn: () => postsService.getFeed().then(r => r.data)
  });
  
  // useMutation — para dar like
  const likeMutation = useMutation({
    mutationFn: (postId) => postsService.darLike(postId),
    onSuccess: () => {
      // Invalida el caché del feed para que se recargue
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
    // Optimistic update — actualiza la UI antes de que responda el servidor
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      const previous = queryClient.getQueryData(['feed']);
      
      queryClient.setQueryData(['feed'], (old) =>
        old.map(post => post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
        )
      );
      
      return { previous }; // Para poder revertir si falla
    },
    onError: (err, postId, context) => {
      // Revertir si el servidor rechazó el like
      queryClient.setQueryData(['feed'], context.previous);
    }
  });
  
  if (isLoading) return <div>Cargando feed...</div>;
  if (error) return <div>Error al cargar el feed</div>;
  
  return (
    <div>
      {posts.map(post => (
        <PostCard 
          key={post.id} 
          post={post}
          onLike={() => likeMutation.mutate(post.id)}
        />
      ))}
    </div>
  );
}`
          },
          concepts_box: [
            { term: "React Query / TanStack Query", simple: "Librería para manejar el estado del servidor: fetching, caching, sincronización y actualizaciones." },
            { term: "queryKey", simple: "Clave única que identifica un query en el caché. Cuando cambia, React Query vuelve a pedir los datos." },
            { term: "staleTime", simple: "Cuánto tiempo considerar los datos 'frescos'. Después, se vuelven a pedir en el fondo." },
            { term: "invalidateQueries", simple: "Le dice a React Query que los datos en caché están desactualizados y deben volver a pedirse." },
            { term: "Optimistic update", simple: "Actualizar la UI inmediatamente como si el servidor ya respondió. Mejora la sensación de rapidez." },
            { term: "useMutation", simple: "Hook de React Query para operaciones que modifican datos (POST, PUT, DELETE)." }
          ],
          resources: [
            { title: "TanStack Query — Documentación oficial", url: "https://tanstack.com/query/latest" },
            { title: "React Query en 30 minutos — video tutorial", url: "https://www.youtube.com/watch?v=r8Dg0KVnfMA" }
          ]
        },
        {
          day: 18,
          emoji: "⏱️",
          title: "Tiempo real con WebSockets",
          subtitle: "Notificaciones y chat que se actualizan solos",
          analogy: "HTTP normal es como mandar cartas: tú preguntas, el servidor responde. WebSockets son como una llamada telefónica: la conexión queda abierta y cualquiera de los dos puede hablar cuando quiera. Perfecto para chat, notificaciones en tiempo real, juegos, y más.",
          concept: `HTTP tiene una limitación: el cliente siempre tiene que iniciar la conversación. Para datos en tiempo real (chat, notificaciones, precios en vivo), esto no es eficiente.\n\nWebSocket abre una conexión persistente bidireccional:\n• Cliente y servidor pueden enviarse mensajes en cualquier momento\n• Sin necesidad de hacer nuevas peticiones HTTP\n• Mucho menos overhead que hacer polling (preguntar cada X segundos)\n\nSocket.io es la librería más popular para WebSockets en Node.js. Añade:\n• Reconexión automática si se cae la conexión\n• Salas (rooms) para grupos de usuarios\n• Eventos con nombre (en lugar de mensajes binarios)\n• Fallback a HTTP polling si WebSockets no está disponible`,
          questions: [
            "¿Cuál es la diferencia entre polling (preguntar cada 5 segundos) y WebSockets? ¿Cuándo polling es suficiente?",
            "Si tienes 10,000 usuarios conectados con WebSockets, ¿qué implica eso para el servidor? ¿Qué recursos consume?",
            "En un chat grupal, ¿cómo envías un mensaje a todos en una sala sin enviárselo a usuarios que no están en esa sala? ¿Qué concepto de Socket.io lo resuelve?"
          ],
          exercise: {
            title: "Chat en tiempo real con Socket.io",
            description: "Agrega un chat en tiempo real a tu red social. Los mensajes aparecen instantáneamente sin recargar la página.",
            steps: [
              "npm install socket.io (en el backend)",
              "npm install socket.io-client (en el frontend)",
              "Configura Socket.io en tu servidor Express",
              "Crea los eventos: 'unirse-a-sala', 'nuevo-mensaje', 'mensaje-recibido'",
              "Crea el componente de chat en React"
            ],
            whatYouWillSee: "Abre dos pestañas del navegador y chatea contigo mismo en tiempo real. Los mensajes aparecen al instante en ambas pestañas.",
            code: `// backend/app.js — Integrar Socket.io con Express
const { createServer } = require('http');
const { Server } = require('socket.io');
const express = require('express');

const app = express();
const httpServer = createServer(app); // Socket.io necesita el servidor HTTP nativo

const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:5173' }
});

// Guardar mensajes en memoria (en producción usarías la DB)
const mensajesPorSala = {};

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);
  
  // El cliente se une a una "sala" (conversación)
  socket.on('unirse-a-sala', ({ salaId, nombreUsuario }) => {
    socket.join(salaId);
    socket.data.nombreUsuario = nombreUsuario;
    socket.data.salaActual = salaId;
    
    // Enviar historial de mensajes al que se une
    const historial = mensajesPorSala[salaId] || [];
    socket.emit('historial', historial);
    
    // Notificar a los demás en la sala
    socket.to(salaId).emit('usuario-entro', { nombreUsuario });
  });
  
  // El cliente envía un mensaje
  socket.on('enviar-mensaje', ({ texto }) => {
    const { salaActual, nombreUsuario } = socket.data;
    
    const mensaje = {
      id: Date.now(),
      texto,
      autor: nombreUsuario,
      hora: new Date().toISOString()
    };
    
    // Guardar en historial
    if (!mensajesPorSala[salaActual]) mensajesPorSala[salaActual] = [];
    mensajesPorSala[salaActual].push(mensaje);
    
    // Enviar a TODOS en la sala (incluyendo quien lo envió)
    io.to(salaActual).emit('nuevo-mensaje', mensaje);
  });
  
  socket.on('disconnect', () => {
    const { salaActual, nombreUsuario } = socket.data;
    if (salaActual) {
      socket.to(salaActual).emit('usuario-salio', { nombreUsuario });
    }
  });
});

httpServer.listen(3000); // Usa httpServer, NO app.listen()

// frontend/Chat.jsx — Componente React
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL);

function Chat({ salaId }) {
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState('');
  const { usuario } = useAuth();
  
  useEffect(() => {
    socket.emit('unirse-a-sala', { salaId, nombreUsuario: usuario.nombre });
    
    socket.on('historial', setMensajes);
    socket.on('nuevo-mensaje', (msg) => {
      setMensajes(prev => [...prev, msg]);
    });
    
    return () => {
      socket.off('historial');
      socket.off('nuevo-mensaje');
    };
  }, [salaId]);
  
  const enviar = () => {
    if (!texto.trim()) return;
    socket.emit('enviar-mensaje', { texto });
    setTexto('');
  };
  
  return (
    <div>
      <div>{mensajes.map(m => <p key={m.id}><b>{m.autor}:</b> {m.texto}</p>)}</div>
      <input value={texto} onChange={e => setTexto(e.target.value)} />
      <button onClick={enviar}>Enviar</button>
    </div>
  );
}`
          },
          concepts_box: [
            { term: "WebSocket", simple: "Protocolo de comunicación bidireccional y persistente entre cliente y servidor." },
            { term: "Socket.io", simple: "Librería que facilita el uso de WebSockets con reconexión automática, salas y eventos nombrados." },
            { term: "Sala (Room)", simple: "Grupo de sockets en Socket.io. Puedes emitir un evento a toda la sala a la vez." },
            { term: "socket.emit()", simple: "Envía un evento solo a ese socket (una persona)." },
            { term: "io.to(sala).emit()", simple: "Envía un evento a TODOS los sockets en una sala." },
            { term: "Polling", simple: "Preguntar al servidor cada N segundos si hay novedades. Menos eficiente que WebSockets pero más simple." }
          ],
          resources: [
            { title: "Socket.io — Tutorial oficial paso a paso", url: "https://socket.io/get-started/chat" },
            { title: "WebSockets explicados — Mozilla MDN", url: "https://developer.mozilla.org/es/docs/Web/API/WebSockets_API" }
          ]
        },
        {
          day: 19,
          emoji: "🗺️",
          title: "¿Y ahora qué? Hoja de ruta y próximos pasos",
          subtitle: "Tienes las bases — este es el camino que sigue",
          analogy: "Aprender a programar es como aprender a nadar. En estas 4 semanas aprendiste a no ahogarte y a hacer los movimientos básicos. Ahora puedes nadar de verdad. El siguiente nivel es aprender diferentes estilos, nadar más rápido, y eventualmente cruzar el canal.",
          concept: `Felicidades — terminaste el programa. Esto es lo que sabes construir ahora:\n\n✅ APIs REST con Express y Node.js\n✅ Bases de datos relacionales con PostgreSQL y Prisma\n✅ Autenticación con JWT y bcrypt\n✅ Validación de datos con Zod\n✅ Subida de archivos a la nube\n✅ Testing con Jest y Supertest\n✅ Deploy con Railway\n✅ Comunicación en tiempo real con WebSockets\n✅ Integración de frontend React con backend\n\nEsto es suficiente para tu primer trabajo o proyecto freelance. El resto se aprende construyendo cosas reales.\n\nPero si quieres seguir creciendo, estos son los temas que te convertirán en un developer senior:`,
          questions: [
            "De todo lo que aprendiste, ¿qué es lo que más te costó entender? Vale la pena revisar eso.",
            "¿Qué proyecto personal construirías con lo que sabes ahora? Descríbelo en términos de tablas, endpoints y features.",
            "¿Cuál es la diferencia entre saber los conceptos y poder aplicarlos sin ayuda? ¿Cómo llegas al segundo nivel?"
          ],
          exercise: {
            title: "Plan de estudio personal — próximas 8 semanas",
            description: "Crea tu propio plan de estudio basado en qué quieres construir. No hay código guía — el ejercicio es reflexivo.",
            steps: [
              "Escribe 3 proyectos que te gustaría construir",
              "Para cada uno, identifica qué tecnologías necesitarías aprender",
              "Elige UNO y empieza a construirlo esta semana",
              "Encuentra una comunidad (Discord de Midudev, freeCodeCamp en español, etc.)",
              "Publica tu proyecto en GitHub"
            ],
            whatYouWillSee: "Un mapa claro de adónde vas y cómo llegar. El mejor aprendizaje ahora es construir proyectos que te importen.",
            code: `// Tu hoja de ruta — próximos 6-12 meses

/* NIVEL INTERMEDIO (lo que sigue)
 * 
 * 📊 Bases de datos avanzadas
 *    - Índices y optimización de queries (EXPLAIN ANALYZE)
 *    - Redis para caché y sesiones
 *    - Transacciones y ACID
 * 
 * 🔒 Seguridad
 *    - OWASP Top 10 (los ataques más comunes)
 *    - Rate limiting y protección contra bots
 *    - Variables de entorno y secretos en producción
 * 
 * 🏗️ Arquitectura
 *    - Clean Architecture / Hexagonal Architecture  
 *    - Domain-Driven Design (DDD) básico
 *    - Patrones de diseño comunes (Repository, Factory, etc.)
 * 
 * 🐳 DevOps básico
 *    - Docker y Docker Compose
 *    - CI/CD con GitHub Actions
 *    - Monitoreo y logs (Sentry para errores)
 * 
 * 📡 Comunicación avanzada
 *    - GraphQL (alternativa a REST)
 *    - Message queues (BullMQ, RabbitMQ)
 *    - Webhooks
 */

/* RECURSOS RECOMENDADOS
 *
 * 📚 Libros:
 *    - "Clean Code" — Robert C. Martin
 *    - "The Pragmatic Programmer" — Hunt & Thomas
 *    - "Designing Data-Intensive Applications" — Kleppmann
 * 
 * 🎥 Canales de YouTube en español:
 *    - Midudev — fullstack, entrevistas, proyectos
 *    - Hola Mundo — fundamentos y proyectos
 *    - Fazt Code — tutoriales prácticos
 * 
 * 🛠️ Practica con:
 *    - LeetCode (algoritmos para entrevistas)
 *    - roadmap.sh/backend (mapa visual completo)
 *    - frontendmentor.io (proyectos frontend con diseño)
 * 
 * 💬 Comunidades:
 *    - Discord de Midudev
 *    - GitHub Discussions
 *    - Dev.to en español
 */

// El secreto del aprendizaje acelerado:
// CONSTRUYE → ROMPE → DEBUGGEA → ENTIENDE → REPITE
// No hay atajo. Cada bug que resuelves vale más que 10 tutoriales.`
          },
          concepts_box: [
            { term: "Docker", simple: "Empaqueta tu app y sus dependencias en un 'contenedor' que funciona igual en cualquier máquina." },
            { term: "CI/CD", simple: "Automatizar los tests y el deploy cada vez que haces push al repositorio." },
            { term: "TypeScript", simple: "JavaScript con tipos. Detecta errores en el editor antes de correr el código." },
            { term: "GraphQL", simple: "Alternativa a REST donde el cliente especifica exactamente qué datos quiere." },
            { term: "Microservicios", simple: "Dividir una app en servicios pequeños e independientes. Para cuando el monolito crece demasiado." },
            { term: "roadmap.sh", simple: "Recurso gratuito con mapas visuales de qué aprender para frontend, backend, DevOps y más." }
          ],
          resources: [
            { title: "roadmap.sh/backend — Mapa completo de Backend Developer", url: "https://roadmap.sh/backend" },
            { title: "roadmap.sh/full-stack — Mapa de Full Stack Developer", url: "https://roadmap.sh/full-stack" },
            { title: "freeCodeCamp en español — cursos gratuitos", url: "https://www.freecodecamp.org/espanol" },
            { title: "Midudev — YouTube en español", url: "https://www.youtube.com/@midudev" }
          ]
        }
      ]
    }
  ]
};

export default function BeginnerBackend() {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  const [activeTab, setActiveTab] = useState("concept");

  const week = curriculum.weeks[selectedWeek];
  const day = week.days[selectedDay];

  const allDays = curriculum.weeks.flatMap(w => w.days);
  const currentDayIndex = allDays.findIndex(d => d.day === day.day);
  const totalDays = allDays.length;

  const goNext = () => {
    if (selectedDay < week.days.length - 1) { setSelectedDay(selectedDay + 1); setActiveTab("concept"); }
    else if (selectedWeek < curriculum.weeks.length - 1) { setSelectedWeek(selectedWeek + 1); setSelectedDay(0); setActiveTab("concept"); }
  };
  const goPrev = () => {
    if (selectedDay > 0) { setSelectedDay(selectedDay - 1); setActiveTab("concept"); }
    else if (selectedWeek > 0) {
      setSelectedWeek(selectedWeek - 1);
      setSelectedDay(curriculum.weeks[selectedWeek - 1].days.length - 1);
      setActiveTab("concept");
    }
  };

  const tabs = [
    { id: "concept", label: "📖 Concepto" },
    { id: "analogy", label: "💡 Analogía" },
    { id: "questions", label: "🤔 Preguntas" },
    { id: "exercise", label: "🛠️ Ejercicio" },
    { id: "keywords", label: "🔑 Glosario" },
    { id: "resources", label: "📚 Recursos" },
  ];

  const progress = ((currentDayIndex) / totalDays) * 100;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAFAF8",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      display: "flex",
      flexDirection: "column",
      color: "#1A1A1A",
    }}>
      {/* Header */}
      <div style={{
        background: "white",
        borderBottom: "2px solid #E8E4DC",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        height: "64px",
        gap: "20px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "24px" }}>🌱</span>
          <div>
            <div style={{
              fontFamily: "'Georgia', serif",
              fontSize: "15px", fontWeight: "700",
              letterSpacing: "-0.02em", color: "#1A1A1A"
            }}>
              Backend desde Cero
            </div>
            <div style={{ fontSize: "11px", color: "#999", fontFamily: "monospace" }}>
              4 semanas · 19 días · de cero a full stack
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ flex: 1, margin: "0 24px" }}>
          <div style={{
            height: "6px", borderRadius: "3px", background: "#E8E4DC",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${week.color}, ${week.color}CC)`,
              borderRadius: "3px",
              transition: "width 0.4s ease",
            }} />
          </div>
          <div style={{ fontSize: "10px", color: "#BBB", marginTop: "3px", fontFamily: "monospace" }}>
            Día {day.day} de {totalDays} — {Math.round(progress)}% completado
          </div>
        </div>

        {/* Week pills */}
        <div style={{ display: "flex", gap: "6px" }}>
          {curriculum.weeks.map((w, i) => (
            <button key={i} onClick={() => { setSelectedWeek(i); setSelectedDay(0); setActiveTab("concept"); }}
              style={{
                width: "32px", height: "32px",
                borderRadius: "50%",
                border: `2px solid ${selectedWeek === i ? w.color : "#E8E4DC"}`,
                background: selectedWeek === i ? w.color : "white",
                color: selectedWeek === i ? "white" : "#999",
                fontSize: "14px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}>
              {w.emoji}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{
          width: "240px", flexShrink: 0,
          background: "white",
          borderRight: "1px solid #E8E4DC",
          overflowY: "auto",
          padding: "16px 0",
        }}>
          {/* Week header */}
          <div style={{
            padding: "8px 20px 16px",
            borderBottom: "1px solid #F0EDE8",
            marginBottom: "8px",
          }}>
            <div style={{ fontSize: "20px", marginBottom: "4px" }}>{week.emoji}</div>
            <div style={{
              fontSize: "12px", fontWeight: "700",
              color: week.color, fontFamily: "monospace",
              letterSpacing: "0.05em", marginBottom: "4px"
            }}>
              SEMANA {week.id}
            </div>
            <div style={{ fontSize: "12px", color: "#555", lineHeight: "1.4", fontFamily: "sans-serif" }}>
              {week.title}
            </div>
          </div>

          {/* Day list */}
          {week.days.map((d, i) => (
            <div key={i} onClick={() => { setSelectedDay(i); setActiveTab("concept"); }}
              style={{
                padding: "10px 20px",
                cursor: "pointer",
                borderLeft: selectedDay === i ? `3px solid ${week.color}` : "3px solid transparent",
                background: selectedDay === i ? `${week.color}0A` : "transparent",
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "16px" }}>{d.emoji}</span>
                <div>
                  <div style={{
                    fontSize: "10px", color: selectedDay === i ? week.color : "#BBB",
                    fontFamily: "monospace", marginBottom: "2px"
                  }}>
                    DÍA {d.day}
                  </div>
                  <div style={{
                    fontSize: "12px",
                    color: selectedDay === i ? "#1A1A1A" : "#777",
                    fontFamily: "sans-serif",
                    lineHeight: "1.3",
                  }}>
                    {d.title}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Other weeks */}
          <div style={{ marginTop: "16px", padding: "16px 20px 0", borderTop: "1px solid #F0EDE8" }}>
            <div style={{ fontSize: "10px", color: "#CCC", fontFamily: "monospace", marginBottom: "8px" }}>
              OTRAS SEMANAS
            </div>
            {curriculum.weeks.filter((_, i) => i !== selectedWeek).map((w, i) => (
              <div key={i} onClick={() => { setSelectedWeek(curriculum.weeks.indexOf(w)); setSelectedDay(0); setActiveTab("concept"); }}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "8px 0", cursor: "pointer",
                  borderBottom: "1px solid #F5F3F0",
                }}>
                <span style={{ fontSize: "16px" }}>{w.emoji}</span>
                <div>
                  <div style={{ fontSize: "11px", color: w.color, fontFamily: "monospace" }}>S{w.id}</div>
                  <div style={{ fontSize: "11px", color: "#777", fontFamily: "sans-serif" }}>{w.tagline}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Day header */}
          <div style={{
            background: "white",
            borderBottom: "1px solid #E8E4DC",
            padding: "20px 32px 16px",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <span style={{ fontSize: "36px", lineHeight: 1 }}>{day.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: "11px", color: week.color,
                  fontFamily: "monospace", letterSpacing: "0.08em",
                  marginBottom: "4px", fontWeight: "700"
                }}>
                  DÍA {day.day} · SEMANA {week.id} — {week.title}
                </div>
                <h1 style={{
                  fontSize: "22px", fontWeight: "700", margin: "0 0 4px",
                  letterSpacing: "-0.02em", lineHeight: "1.2",
                }}>
                  {day.title}
                </h1>
                <div style={{ fontSize: "14px", color: "#777", fontFamily: "sans-serif" }}>
                  {day.subtitle}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "2px", marginTop: "16px", overflowX: "auto" }}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "7px 14px",
                    border: "none",
                    borderRadius: "6px",
                    background: activeTab === tab.id ? week.color : "transparent",
                    color: activeTab === tab.id ? "white" : "#888",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontFamily: "sans-serif",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s",
                    fontWeight: activeTab === tab.id ? "600" : "400",
                  }}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
            <div style={{ maxWidth: "760px" }}>

              {/* CONCEPT */}
              {activeTab === "concept" && (
                <div>
                  <div style={{
                    background: "white",
                    border: "1px solid #E8E4DC",
                    borderRadius: "12px",
                    padding: "28px",
                    lineHeight: "1.85",
                    fontSize: "15px",
                    color: "#333",
                    fontFamily: "sans-serif",
                    whiteSpace: "pre-line",
                  }}>
                    {day.concept}
                  </div>
                </div>
              )}

              {/* ANALOGY */}
              {activeTab === "analogy" && (
                <div style={{
                  background: `${week.color}08`,
                  border: `1px solid ${week.color}30`,
                  borderRadius: "12px",
                  padding: "28px",
                }}>
                  <div style={{ fontSize: "32px", marginBottom: "16px" }}>💡</div>
                  <div style={{
                    fontSize: "14px", color: "#555",
                    fontFamily: "sans-serif", letterSpacing: "0.05em",
                    textTransform: "uppercase", marginBottom: "12px",
                    fontWeight: "600",
                  }}>
                    Analogía del mundo real
                  </div>
                  <p style={{
                    fontSize: "17px",
                    lineHeight: "1.8",
                    color: "#222",
                    fontStyle: "italic",
                    borderLeft: `4px solid ${week.color}`,
                    paddingLeft: "20px",
                    margin: 0,
                    fontFamily: "Georgia, serif",
                  }}>
                    {day.analogy}
                  </p>
                </div>
              )}

              {/* QUESTIONS */}
              {activeTab === "questions" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{
                    padding: "12px 16px",
                    background: "#FFFBF0",
                    border: "1px solid #FDE68A",
                    borderRadius: "8px",
                    fontSize: "13px",
                    color: "#92400E",
                    fontFamily: "sans-serif",
                  }}>
                    💭 <strong>Consejo:</strong> Intenta responder cada pregunta antes de buscar la respuesta. El proceso de pensar es donde ocurre el aprendizaje real.
                  </div>
                  {day.questions.map((q, i) => (
                    <div key={i} style={{
                      background: "white",
                      border: "1px solid #E8E4DC",
                      borderRadius: "10px",
                      padding: "20px 22px",
                      display: "flex",
                      gap: "14px",
                    }}>
                      <div style={{
                        width: "30px", height: "30px", flexShrink: 0,
                        background: week.color,
                        borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "white", fontSize: "13px", fontWeight: "700",
                        fontFamily: "monospace",
                      }}>
                        {i + 1}
                      </div>
                      <p style={{
                        margin: 0, fontSize: "14px",
                        lineHeight: "1.7", color: "#333",
                        fontFamily: "sans-serif",
                      }}>
                        {q}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* EXERCISE */}
              {activeTab === "exercise" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{
                    background: "white",
                    border: "1px solid #E8E4DC",
                    borderRadius: "10px",
                    padding: "22px",
                  }}>
                    <div style={{
                      fontSize: "16px", fontWeight: "700",
                      marginBottom: "8px", color: "#1A1A1A",
                    }}>
                      🛠️ {day.exercise.title}
                    </div>
                    <p style={{
                      fontSize: "14px", color: "#555",
                      lineHeight: "1.7", margin: "0 0 16px",
                      fontFamily: "sans-serif",
                    }}>
                      {day.exercise.description}
                    </p>

                    <div style={{ marginBottom: "16px" }}>
                      <div style={{
                        fontSize: "11px", color: "#999",
                        fontFamily: "monospace", letterSpacing: "0.1em",
                        marginBottom: "8px"
                      }}>
                        PASOS
                      </div>
                      {day.exercise.steps.map((step, i) => (
                        <div key={i} style={{
                          display: "flex", gap: "10px",
                          padding: "6px 0",
                          borderBottom: i < day.exercise.steps.length - 1 ? "1px solid #F5F3F0" : "none",
                          alignItems: "flex-start",
                        }}>
                          <div style={{
                            width: "20px", height: "20px",
                            borderRadius: "50%",
                            border: `1px solid ${week.color}`,
                            color: week.color,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "10px", fontFamily: "monospace",
                            flexShrink: 0, marginTop: "1px",
                          }}>
                            {i + 1}
                          </div>
                          <span style={{ fontSize: "13px", color: "#555", fontFamily: "sans-serif", lineHeight: "1.5" }}>
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div style={{
                      background: "#F0FDF4",
                      border: "1px solid #BBF7D0",
                      borderRadius: "8px",
                      padding: "12px 14px",
                      fontSize: "13px",
                      color: "#166534",
                      fontFamily: "sans-serif",
                    }}>
                      <strong>✅ Qué deberías ver:</strong> {day.exercise.whatYouWillSee}
                    </div>
                  </div>

                  {day.exercise.code && (
                    <div style={{
                      borderRadius: "10px",
                      overflow: "hidden",
                      border: "1px solid #E8E4DC",
                    }}>
                      <div style={{
                        background: "#2D2D2D",
                        padding: "10px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}>
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FF5F56" }} />
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FFBD2E" }} />
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#27C93F" }} />
                        <span style={{
                          marginLeft: "8px", fontSize: "11px",
                          color: "#888", fontFamily: "monospace"
                        }}>código guía</span>
                      </div>
                      <pre style={{
                        margin: 0, padding: "24px",
                        background: "#1E1E1E",
                        color: "#D4D4D4",
                        fontSize: "12px",
                        lineHeight: "1.7",
                        overflowX: "auto",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                      }}>
                        {day.exercise.code}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* KEYWORDS / GLOSARIO */}
              {activeTab === "keywords" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{
                    fontSize: "13px", color: "#777",
                    fontFamily: "sans-serif", marginBottom: "8px"
                  }}>
                    Estos son los términos del día. Deberías poder explicarlos con tus propias palabras.
                  </div>
                  {day.concepts_box.map((item, i) => (
                    <div key={i} style={{
                      background: "white",
                      border: "1px solid #E8E4DC",
                      borderRadius: "8px",
                      padding: "14px 18px",
                      display: "flex",
                      gap: "16px",
                      alignItems: "flex-start",
                    }}>
                      <div style={{
                        background: `${week.color}15`,
                        border: `1px solid ${week.color}30`,
                        borderRadius: "6px",
                        padding: "4px 10px",
                        fontSize: "12px",
                        fontFamily: "monospace",
                        color: week.color,
                        fontWeight: "700",
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                      }}>
                        {item.term}
                      </div>
                      <div style={{
                        fontSize: "13px",
                        color: "#555",
                        lineHeight: "1.5",
                        fontFamily: "sans-serif",
                      }}>
                        {item.simple}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* RESOURCES */}
              {activeTab === "resources" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{
                    fontSize: "13px", color: "#777",
                    fontFamily: "sans-serif", marginBottom: "8px"
                  }}>
                    Recursos para profundizar. No tienes que verlos todos — elige el que más te llame.
                  </div>
                  {day.resources.map((r, i) => (
                    <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                      style={{
                        background: "white",
                        border: "1px solid #E8E4DC",
                        borderRadius: "8px",
                        padding: "14px 18px",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        textDecoration: "none",
                        color: "inherit",
                        cursor: "pointer",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = week.color;
                        e.currentTarget.style.background = `${week.color}05`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "#E8E4DC";
                        e.currentTarget.style.background = "white";
                      }}>
                      <div style={{
                        width: "36px", height: "36px",
                        background: `${week.color}15`,
                        borderRadius: "8px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "16px", flexShrink: 0,
                      }}>
                        🔗
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: "600", color: "#222", fontFamily: "sans-serif" }}>
                          {r.title}
                        </div>
                        <div style={{ fontSize: "11px", color: "#BBB", fontFamily: "monospace", marginTop: "2px" }}>
                          {r.url}
                        </div>
                      </div>
                      <span style={{ color: "#CCC", fontSize: "16px" }}>→</span>
                    </a>
                  ))}
                </div>
              )}

            </div>
          </div>

          {/* Bottom nav */}
          <div style={{
            background: "white",
            borderTop: "1px solid #E8E4DC",
            padding: "14px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <button onClick={goPrev}
              disabled={selectedWeek === 0 && selectedDay === 0}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "8px 18px",
                border: "1px solid #E8E4DC",
                borderRadius: "8px",
                background: "white",
                cursor: selectedWeek === 0 && selectedDay === 0 ? "not-allowed" : "pointer",
                opacity: selectedWeek === 0 && selectedDay === 0 ? 0.4 : 1,
                fontSize: "13px",
                color: "#666",
                fontFamily: "sans-serif",
              }}>
              ← Anterior
            </button>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#1A1A1A" }}>
                {day.emoji} {day.title}
              </div>
              <div style={{ fontSize: "11px", color: "#BBB", fontFamily: "monospace" }}>
                Día {day.day} de {totalDays}
              </div>
            </div>

            <button onClick={goNext}
              disabled={selectedWeek === curriculum.weeks.length - 1 && selectedDay === week.days.length - 1}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "8px 18px",
                border: "none",
                borderRadius: "8px",
                background: week.color,
                color: "white",
                cursor: "pointer",
                fontSize: "13px",
                fontFamily: "sans-serif",
                fontWeight: "600",
                opacity: selectedWeek === curriculum.weeks.length - 1 && selectedDay === week.days.length - 1 ? 0.4 : 1,
              }}>
              Siguiente →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
