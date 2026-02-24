import { useState } from "react";

const data = {
  weeks: [
    {
      id: 1,
      title: "HTTP & Fundamentos del Servidor",
      color: "#00D4FF",
      accent: "#003D4D",
      days: [
        {
          day: 1,
          title: "Cómo funciona realmente un servidor HTTP",
          concept: `Un servidor HTTP es un proceso que escucha en un puerto TCP, acepta conexiones, lee bytes del socket, parsea esos bytes como texto HTTP y genera una respuesta. HTTP/1.1 es texto plano sobre TCP; HTTP/2 es binario y multiplexado. El servidor usa un event loop (Node.js), thread pool (Java), o goroutines (Go). Cada arquitectura tiene consecuencias en throughput, latencia y uso de memoria.`,
          questions: [
            "Si Node.js tiene un solo hilo, ¿qué pasa exactamente cuando dos requests llegan simultáneamente? ¿Cuál es el riesgo real si una operación de CPU intensiva bloquea el event loop?",
            "¿Por qué HTTP/2 mejora el rendimiento frente a HTTP/1.1 aunque ambos corran sobre TCP? ¿En qué escenarios HTTP/1.1 podría ser preferible?",
            "¿Qué diferencia conceptual hay entre un servidor que usa fork() por cada request (Apache clásico) vs. uno que usa event loop (Nginx/Node)? ¿Cuándo se rompe cada modelo?"
          ],
          exercise: {
            title: "Servidor HTTP desde cero con sockets crudos",
            description: "Crea un servidor HTTP sin usar el módulo `http` de Node. Usa `net.createServer`, parsea manualmente el request y responde con HTTP/1.1 válido. Luego observa con `curl -v`.",
            code: `const net = require('net');

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const request = data.toString();
    const firstLine = request.split('\\r\\n')[0];
    console.log('Request line:', firstLine);

    const body = 'Hello from raw socket!';
    const response = [
      'HTTP/1.1 200 OK',
      'Content-Type: text/plain',
      \`Content-Length: \${Buffer.byteLength(body)}\`,
      'Connection: close',
      '',
      body
    ].join('\\r\\n');

    socket.write(response);
    socket.end();
  });
});

server.listen(3000, () => console.log('Listening on :3000'));`
          },
          keywords: ["TCP handshake", "socket", "event loop", "non-blocking I/O", "thread pool", "keep-alive", "multiplexing", "head-of-line blocking"],
          resources: [
            { title: "High Performance Browser Networking — Ilya Grigorik", url: "https://hpbn.co" },
            { title: "RFC 7230 — HTTP/1.1 Message Syntax", url: "https://tools.ietf.org/html/rfc7230" },
            { title: "What is the event loop? — Philip Roberts (JSConf EU)", url: "https://www.youtube.com/watch?v=8aGhZQkoFbQ" }
          ]
        },
        {
          day: 2,
          title: "Headers, Status Codes y el Contrato HTTP",
          concept: `Los status codes no son decorativos. 200 vs 201 vs 204 tiene implicaciones en cómo el cliente cachea o reintenta. Los headers son el mecanismo de negociación: Content-Type determina cómo se parsea el body, Cache-Control define la política de caché, Authorization transporta credenciales. Entender este contrato es la base de cualquier API bien diseñada.`,
          questions: [
            "¿Cuál es la diferencia semántica entre PUT y PATCH? Si implementas actualización parcial con PUT, ¿qué implicaciones tiene para la idempotencia?",
            "Un cliente recibe 401 vs 403. ¿Qué decisión diferente debe tomar en cada caso? ¿Por qué muchas APIs usan 403 cuando deberían usar 401 y qué problema de seguridad genera?",
            "Cache-Control: no-cache vs. Cache-Control: no-store — ¿son equivalentes? ¿Cuál es más agresivo y por qué?"
          ],
          exercise: {
            title: "Semántica correcta de códigos de estado en Express",
            description: "Construye un servidor que devuelva 201 + header Location al crear, 204 al eliminar, 409 en conflicto, y 422 para errores de validación semántica (distinto de 400 que es sintaxis). Prueba con curl.",
            code: `app.post('/users', async (req, res) => {
  const { email } = req.body;
  const existing = await db.users.findByEmail(email);
  
  if (existing) {
    return res.status(409).json({ 
      error: 'Email already registered' 
    });
  }
  
  // 422: datos bien formados pero semánticamente inválidos
  if (!isValidEmailDomain(email)) {
    return res.status(422).json({ 
      error: 'Email domain not allowed' 
    });
  }
  
  const user = await db.users.create(req.body);
  res.status(201)
     .location(\`/users/\${user.id}\`)
     .json(user);
});

app.delete('/users/:id', async (req, res) => {
  await db.users.delete(req.params.id);
  res.status(204).send(); // No content
});`
          },
          keywords: ["idempotencia", "seguridad de métodos HTTP", "content negotiation", "ETag", "Last-Modified", "conditional request", "CORS preflight", "OPTIONS"],
          resources: [
            { title: "MDN — HTTP Status Codes (todos los 4xx y 5xx)", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status" },
            { title: "RFC 7231 — Semántica HTTP", url: "https://tools.ietf.org/html/rfc7231" },
            { title: "RESTful Web APIs — Leonard Richardson", url: "https://www.oreilly.com/library/view/restful-web-apis/9781449359713/" }
          ]
        },
        {
          day: 3,
          title: "Arquitectura REST vs. otras alternativas",
          concept: `REST no es solo "usar HTTP con JSON". Fielding definió 6 restricciones: cliente-servidor, stateless, cacheable, interfaz uniforme, sistema en capas, code-on-demand. La restricción más violada es HATEOAS: las respuestas deben incluir links a las acciones posibles. La mayoría de APIs son HTTP APIs o RPC sobre HTTP, no REST puro. GraphQL resuelve over-fetching/under-fetching a costa de complejidad. gRPC resuelve performance y contratos estrictos a costa de legibilidad.`,
          questions: [
            "Si REST exige ser stateless, ¿cómo se maneja la autenticación de forma correctamente RESTful? ¿Las sesiones del servidor violan REST? ¿Y JWT?",
            "¿En qué escenarios concretos GraphQL es peor opción que REST? Considera caching, queries maliciosas y el N+1 problem.",
            "gRPC usa Protocol Buffers. ¿Qué ventajas concretas da la serialización binaria frente a JSON y en qué contextos no justifica el overhead de configuración?"
          ],
          exercise: {
            title: "API con HATEOAS + documentación OpenAPI 3.0",
            description: "Diseña e implementa una API de biblioteca con /books, /authors, /loans. Cada respuesta debe incluir un objeto _links con las acciones disponibles. Documenta con Swagger UI.",
            code: `// Respuesta con HATEOAS
{
  "id": "123",
  "title": "Clean Code",
  "author": { "id": "456", "name": "Robert Martin" },
  "_links": {
    "self": { "href": "/books/123", "method": "GET" },
    "update": { "href": "/books/123", "method": "PUT" },
    "delete": { "href": "/books/123", "method": "DELETE" },
    "loans": { "href": "/books/123/loans", "method": "GET" },
    "author": { "href": "/authors/456", "method": "GET" }
  }
}

// openapi.yaml
paths:
  /books/{id}:
    get:
      summary: Get a book
      responses:
        '200':
          description: Book with hypermedia links
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BookWithLinks'`
          },
          keywords: ["HATEOAS", "stateless", "resource vs. action", "over-fetching", "under-fetching", "N+1 problem", "Protocol Buffers", "schema-first", "OpenAPI"],
          resources: [
            { title: "Tesis doctoral de Roy Fielding — Capítulo 5", url: "https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm" },
            { title: "Documentación oficial gRPC", url: "https://grpc.io/docs/" },
            { title: "OpenAPI Specification", url: "https://swagger.io/specification/" }
          ]
        },
        {
          day: 4,
          title: "Middleware y el Pipeline de Request/Response",
          concept: `El patrón middleware es una cadena de funciones donde cada una puede modificar el request, la response, o pasar el control a la siguiente. Es el corazón de Express, Koa, ASP.NET, Laravel. Lo no obvio: el orden de ejecución, el manejo de errores asíncronos, y la diferencia entre middleware global, de router y de ruta. El middleware no es solo para logging o auth — también para rate limiting, compresión, correlación de requests y circuit breaking.`,
          questions: [
            "Si tienes un middleware de manejo de errores en Express y uno de tus middlewares lanza una excepción asíncrona (Promise rechazado), ¿llega automáticamente al error handler? ¿Qué cambia entre Express 4 y Express 5?",
            "¿Por qué el orden del middleware importa tanto? Da un ejemplo concreto donde cambiar el orden de autenticación y logging causa un problema de seguridad.",
            "Diseña una cadena de middleware para una API bancaria. ¿Qué va primero, el rate limiter o la autenticación? ¿Por qué? ¿Tiene implicaciones de seguridad el orden?"
          ],
          exercise: {
            title: "Mini-framework de middleware desde cero",
            description: "Implementa sin librerías externas un sistema que replique app.use() de Express, incluyendo error handlers con 4 parámetros. Aplícalo con: logging + correlationId, validación de token, y error handler global.",
            code: `class MiniExpress {
  constructor() { this.middlewares = []; }
  
  use(fn) { this.middlewares.push(fn); }
  
  handle(req, res) {
    let idx = 0;
    const next = (err) => {
      if (idx >= this.middlewares.length) return;
      const middleware = this.middlewares[idx++];
      try {
        if (err && middleware.length === 4) {
          middleware(err, req, res, next);
        } else if (!err && middleware.length !== 4) {
          middleware(req, res, next);
        } else {
          next(err); // skip non-error middleware when error
        }
      } catch (e) {
        next(e);
      }
    };
    next();
  }
}

// Uso
const app = new MiniExpress();

app.use((req, res, next) => {
  req.correlationId = crypto.randomUUID();
  console.log(\`[\${req.correlationId}] \${req.method} \${req.url}\`);
  next();
});

// Error handler (4 parámetros)
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});`
          },
          keywords: ["middleware chain", "next()", "error-first middleware", "correlation ID", "request lifecycle", "cross-cutting concerns", "pipeline pattern"],
          resources: [
            { title: "Código fuente de Express — router/layer.js", url: "https://github.com/expressjs/express/blob/master/lib/router/layer.js" },
            { title: "Designing Web APIs — Brenda Jin (O'Reilly)", url: "https://www.oreilly.com/library/view/designing-web-apis/9781492026914/" }
          ]
        },
        {
          day: 5,
          title: "Autenticación vs. Autorización en Profundidad",
          concept: `Autenticación es "¿quién eres?", autorización es "¿qué puedes hacer?". JWT es el estándar más usado pero también el más mal implementado: el error más común es no validar la firma, usar 'alg: none', o guardar el token en localStorage (vulnerable a XSS). OAuth 2.0 no es un protocolo de autenticación — es de autorización delegada. OpenID Connect añade la capa de identidad. Los modelos de autorización son RBAC (roles), ABAC (atributos), ReBAC (relaciones).`,
          questions: [
            "JWT se firma pero no se encripta por defecto. ¿Qué información nunca deberías poner en un JWT? ¿Por qué guardar el JWT en cookie HttpOnly es más seguro que localStorage, y qué nuevo vector de ataque introduce?",
            "Si implementas refresh tokens, ¿cómo detectas y manejas el robo de un refresh token? Explica el mecanismo de 'refresh token rotation' y qué pasa cuando el token robado se usa antes que el legítimo.",
            "¿En qué escenario RBAC se queda corto y necesitas ABAC? Da un ejemplo de negocio concreto."
          ],
          exercise: {
            title: "Sistema de autenticación completo con rotación de tokens",
            description: "Implementa: registro con bcrypt, login que emite access token (15min) y refresh token (7 días) en cookie HttpOnly, rotación con detección de reutilización, y logout que invalida el token en DB.",
            code: `// Refresh token rotation con detección de robo
async function refreshToken(req, res) {
  const { refreshToken } = req.cookies;
  
  const tokenRecord = await db.refreshTokens.findOne({ 
    token: refreshToken 
  });
  
  // Token no existe en DB → posible robo
  if (!tokenRecord) {
    // Invalidar TODOS los tokens del usuario (familia comprometida)
    await db.refreshTokens.deleteAll({ userId: tokenRecord?.userId });
    return res.status(401).json({ error: 'Token reuse detected' });
  }
  
  // Rotar: eliminar el viejo, crear uno nuevo
  await db.refreshTokens.delete(refreshToken);
  const newRefreshToken = crypto.randomUUID();
  await db.refreshTokens.create({ 
    token: newRefreshToken, 
    userId: tokenRecord.userId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });
  
  const accessToken = jwt.sign(
    { userId: tokenRecord.userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  res.cookie('refreshToken', newRefreshToken, { 
    httpOnly: true, 
    secure: true, 
    sameSite: 'strict' 
  });
  res.json({ accessToken });
}`
          },
          keywords: ["JWT", "JWS", "JWE", "OAuth 2.0", "OpenID Connect", "PKCE", "refresh token rotation", "bcrypt cost factor", "RBAC", "ABAC", "session fixation"],
          resources: [
            { title: "jwt.io — decodifica y valida tokens en tiempo real", url: "https://jwt.io" },
            { title: "RFC 9700 — OAuth 2.0 Security Best Current Practice", url: "https://tools.ietf.org/html/rfc9700" },
            { title: "Auth0 Blog — Refresh Token Rotation", url: "https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/" }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Bases de Datos y Persistencia",
      color: "#00FF94",
      accent: "#003D20",
      days: [
        {
          day: 6,
          title: "SQL Avanzado y el Modelo Relacional",
          concept: `La mayoría usa SQL para queries básicos pero no entiende el modelo relacional: álgebra relacional, normalización hasta 3FN/BCNF, y cuándo desnormalizar deliberadamente. El query planner genera un plan de ejecución (Seq Scan vs. Index Scan) basado en estadísticas. Un query lento no es problema del hardware sino del plan. EXPLAIN ANALYZE es la herramienta más importante de un backend developer que trabaja con SQL.`,
          questions: [
            "Una tabla tiene un índice en la columna email. Ejecutas SELECT * FROM users WHERE lower(email) = lower($1). ¿Se usa el índice? ¿Por qué? ¿Cómo lo arreglarías?",
            "Tienes una tabla orders con 50M filas. El query SELECT * FROM orders WHERE status = 'pending' es lento aunque status tiene índice. EXPLAIN ANALYZE muestra Seq Scan. ¿Cuándo el planner decide ignorar un índice y por qué puede ser la decisión correcta?",
            "¿Cuál es la diferencia entre un índice parcial, un índice compuesto y un covering index? Da un caso de uso concreto para cada uno."
          ],
          exercise: {
            title: "Query optimizer con EXPLAIN ANALYZE",
            description: "Con PostgreSQL, crea un esquema de e-commerce. Escribe un query que encuentre los 10 clientes que más gastaron en el último mes con su producto favorito. Usa EXPLAIN ANALYZE, identifica Seq Scans evitables y mide antes/después de crear índices.",
            code: `-- Antes: Query sin optimizar
SELECT u.id, u.name, 
       SUM(oi.price * oi.quantity) as total_spent,
       (SELECT p.name FROM order_items oi2 
        JOIN products p ON p.id = oi2.product_id
        WHERE oi2.order_id IN (
          SELECT id FROM orders WHERE user_id = u.id
        )
        GROUP BY p.id ORDER BY COUNT(*) DESC LIMIT 1) as fav_product
FROM users u
JOIN orders o ON o.user_id = u.id  
JOIN order_items oi ON oi.order_id = o.id
WHERE o.created_at >= NOW() - INTERVAL '1 month'
GROUP BY u.id ORDER BY total_spent DESC LIMIT 10;

-- Ejecuta para ver el plan
EXPLAIN ANALYZE <query_anterior>;

-- Después: Índices estratégicos
CREATE INDEX idx_orders_user_created 
  ON orders(user_id, created_at DESC);
CREATE INDEX idx_order_items_order_product 
  ON order_items(order_id, product_id);

-- Query optimizado con CTE y window functions
WITH monthly_orders AS (
  SELECT o.id, o.user_id
  FROM orders o
  WHERE o.created_at >= NOW() - INTERVAL '1 month'
),
-- ... resto del query optimizado`
          },
          keywords: ["query planner", "Seq Scan vs. Index Scan", "B-tree index", "partial index", "covering index", "normalization", "BCNF", "window functions", "CTE", "EXPLAIN ANALYZE"],
          resources: [
            { title: "use-the-index-luke.com — guía gratuita de índices SQL", url: "https://use-the-index-luke.com" },
            { title: "pgexercises.com — ejercicios interactivos de PostgreSQL", url: "https://pgexercises.com" },
            { title: "PostgreSQL: Up and Running — Regina Obe", url: "https://www.oreilly.com/library/view/postgresql-up-and/9781491963401/" }
          ]
        },
        {
          day: 7,
          title: "Transacciones, ACID y Niveles de Aislamiento",
          concept: `ACID es la promesa de una base de datos transaccional. El nivel de aislamiento es una variable, no un absoluto. SQL define 4 niveles: Read Uncommitted, Read Committed, Repeatable Read, Serializable. Cada nivel previene ciertos fenómenos: dirty reads, non-repeatable reads, phantom reads. PostgreSQL usa MVCC (Multi-Version Concurrency Control): mantiene versiones históricas permitiendo que lecturas y escrituras no se bloqueen mutuamente.`,
          questions: [
            "Dos transacciones leen el saldo de una cuenta (100), ambas restan 50 y escriben 50. El resultado es 50 pero debería ser 0. ¿Qué fenómeno de concurrencia es este y en qué nivel de aislamiento se previene?",
            "¿Por qué usar SERIALIZABLE en todo no es la solución? ¿Qué costo tiene en throughput?",
            "Un deadlock ocurre en tu sistema de pagos en producción. ¿Cómo lo detectas, reproduces en dev y resuelves a nivel de código sin simplemente aumentar el timeout?"
          ],
          exercise: {
            title: "Transferencia bancaria correcta bajo concurrencia",
            description: "Implementa transferencia bancaria con bloqueo pesimista (SELECT FOR UPDATE) y luego con bloqueo optimista (columna version). Prueba con 100 requests concurrentes y verifica que el saldo final sea siempre correcto.",
            code: `// Bloqueo pesimista — SELECT FOR UPDATE
async function transferPessimistic(fromId, toId, amount) {
  await db.transaction(async (trx) => {
    // Bloquear ambas cuentas en orden consistente (evitar deadlock)
    const [from, to] = await Promise.all([
      trx('accounts').where('id', fromId).forUpdate().first(),
      trx('accounts').where('id', toId).forUpdate().first()
    ]);
    
    if (from.balance < amount) throw new Error('Insufficient funds');
    
    await trx('accounts').where('id', fromId)
      .update({ balance: from.balance - amount });
    await trx('accounts').where('id', toId)
      .update({ balance: to.balance + amount });
  });
}

// Bloqueo optimista — columna version
async function transferOptimistic(fromId, toId, amount) {
  const from = await db('accounts').where('id', fromId).first();
  if (from.balance < amount) throw new Error('Insufficient funds');
  
  const updated = await db('accounts')
    .where({ id: fromId, version: from.version }) // CAS
    .update({ 
      balance: from.balance - amount, 
      version: from.version + 1 
    });
  
  if (updated === 0) throw new Error('Concurrent modification — retry');
  // ... actualizar cuenta destino
}`
          },
          keywords: ["ACID", "MVCC", "dirty read", "phantom read", "lost update", "SELECT FOR UPDATE", "optimistic locking", "pessimistic locking", "deadlock", "savepoint"],
          resources: [
            { title: "Designing Data-Intensive Applications — Kleppmann (Capítulo 7)", url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/" },
            { title: "PostgreSQL docs — Transaction Isolation", url: "https://www.postgresql.org/docs/current/transaction-iso.html" }
          ]
        },
        {
          day: 8,
          title: "NoSQL: cuándo, por qué y a qué costo",
          concept: `NoSQL no es "SQL pero más rápido". Cada familia resuelve un problema específico: document stores (MongoDB) dan flexibilidad de schema; key-value (Redis) dan velocidad extrema; wide-column (Cassandra) dan escalabilidad horizontal de escrituras; graph databases (Neo4j) hacen eficientes las queries de relaciones complejas. El teorema CAP dice que un sistema distribuido solo puede garantizar dos de tres: Consistencia, Disponibilidad, Tolerancia a particiones.`,
          questions: [
            "MongoDB permite documentos embebidos o referencias. ¿Cuándo embeddes y cuándo referencias? Si siempre embedes, ¿qué problema surge a escala? Si siempre referencias, ¿en qué te conviertes?",
            "En Cassandra, el modelo de datos debe diseñarse a partir de las queries, no de las entidades. ¿Por qué? ¿Qué implica para un equipo acostumbrado a SQL?",
            "El teorema CAP ha sido criticado por ser demasiado simplista. ¿Qué agrega el modelo PACELC y por qué es más útil para decisiones de arquitectura reales?"
          ],
          exercise: {
            title: "El mismo esquema en SQL, MongoDB y Neo4j",
            description: "Diseña el esquema de una red social simple en tres modelos distintos. El caso de uso: 'mostrar el feed de un usuario con los posts de las personas que sigue'. Analiza el query en cada modelo y argumenta cuál elegirías para 10M usuarios.",
            code: `-- SQL (PostgreSQL)
SELECT p.* FROM posts p
JOIN follows f ON f.following_id = p.user_id
WHERE f.follower_id = $1
ORDER BY p.created_at DESC LIMIT 20;

// MongoDB — embed vs reference trade-off
// Opción embedded (problemática a escala):
{ userId: "123", posts: [...] } // documento crece sin límite

// Opción referenciada:
db.posts.find({ 
  userId: { $in: followingIds } 
}).sort({ createdAt: -1 }).limit(20)
// Problem: N+1 para obtener followingIds

// Neo4j — query de grafo natural
MATCH (me:User {id: $userId})-[:FOLLOWS]->(friend:User)
      <-[:POSTED_BY]-(post:Post)
RETURN post ORDER BY post.createdAt DESC LIMIT 20`
          },
          keywords: ["teorema CAP", "PACELC", "eventual consistency", "sharding", "replication", "document model", "wide-column", "schema-on-read vs schema-on-write", "denormalization"],
          resources: [
            { title: "Designing Data-Intensive Applications — Kleppmann (Capítulos 2 y 5)", url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/" },
            { title: "MongoDB University — M001 (gratis)", url: "https://university.mongodb.com" }
          ]
        },
        {
          day: 9,
          title: "Redis y Caché en Profundidad",
          concept: `Redis no es solo un caché — es una estructura de datos en memoria con persistencia opcional. Sus estructuras (strings, hashes, lists, sets, sorted sets, streams) permiten implementar rate limiting con sliding window, leaderboards en tiempo real, pub/sub y colas de trabajo. Para caché: estrategia de invalidación (TTL, event-driven, manual), política de eviction cuando la memoria se llena (LRU, LFU), y el problema de cache stampede cuando muchas requests intentan refrescar el caché simultáneamente.`,
          questions: [
            "Tienes un endpoint que hace una query SQL que tarda 2 segundos. Lo cacheas en Redis con TTL de 60s. A las 00:00 expira y 500 usuarios hacen la request simultáneamente. ¿Qué pasa? ¿Cómo lo prevendrías con probabilistic early expiration o mutex distribuido?",
            "¿Cuál es la diferencia entre EXPIRE y EXPIREAT en Redis y cuándo el uso incorrecto genera bugs sutiles en sistemas con múltiples zonas horarias?",
            "Si necesitas que Redis sea durable (no perder datos al reiniciar), ¿qué opciones tienes entre RDB snapshots y AOF, y qué trade-off tiene cada uno?"
          ],
          exercise: {
            title: "Rate limiter con sliding window + cache stampede protection",
            description: "Implementa un rate limiter con sliding window usando Redis sorted sets (atómico con Lua). Límite: 100 req/min por IP. Luego implementa cache-aside con lock distribuido contra stampede.",
            code: `-- Lua script para rate limiter atómico (sliding window)
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])  -- 60000ms
local limit = tonumber(ARGV[3])   -- 100

-- Eliminar entradas fuera de la ventana
redis.call('ZREMRANGEBYSCORE', key, 0, now - window)

local count = redis.call('ZCARD', key)
if count >= limit then
  return 0  -- Rate limited
end

redis.call('ZADD', key, now, now .. math.random())
redis.call('EXPIRE', key, math.ceil(window / 1000))
return 1  -- Allowed

// Node.js — Cache stampede protection con mutex
async function getWithLock(key, fetchFn, ttl) {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  
  const lockKey = \`lock:\${key}\`;
  const acquired = await redis.set(lockKey, '1', 'NX', 'EX', 10);
  
  if (!acquired) {
    // Otro proceso está refrescando, esperar con backoff
    await sleep(100);
    return getWithLock(key, fetchFn, ttl);
  }
  
  try {
    const data = await fetchFn();
    await redis.setex(key, ttl, JSON.stringify(data));
    return data;
  } finally {
    await redis.del(lockKey);
  }
}`
          },
          keywords: ["cache-aside", "write-through", "write-behind", "cache stampede", "thundering herd", "TTL", "LRU", "LFU", "Redis Lua scripting", "distributed lock", "pub/sub", "Redis Streams"],
          resources: [
            { title: "Redis Documentation — Data Structures", url: "https://redis.io/docs/data-types/" },
            { title: "Redis in Action — Josiah Carlson", url: "https://www.manning.com/books/redis-in-action" },
            { title: "Cloudflare Blog — How to Handle Cache Stampede", url: "https://blog.cloudflare.com" }
          ]
        },
        {
          day: 10,
          title: "ORM, Query Builders y el Impedance Mismatch",
          concept: `El "impedance mismatch" es la fricción entre el modelo orientado a objetos y el modelo relacional. Los ORMs (Prisma, TypeORM, Sequelize) resuelven esto automáticamente pero pueden generar SQL ineficiente, ocultar complejidad y crear abstracciones que "gotean". El N+1 problem: cargas autores y por cada uno disparas otra query para sus libros, resultando en 1+N queries en lugar de un JOIN. Entender cuándo confiar en el ORM y cuándo escribir SQL crudo es una habilidad senior.`,
          questions: [
            "¿En qué condiciones un ORM puede generar un SELECT * sin que el desarrollador lo note, y por qué es un problema en tablas con columnas TEXT o JSONB grandes?",
            "Prisma usa una arquitectura diferente a TypeORM — un proceso separado (query engine). ¿Qué ventajas y desventajas concretas tiene en performance, debugging y compatibilidad?",
            "Si el ORM no puede expresar una query compleja, ¿cuál es la estrategia correcta? Compara raw queries, query builders (Knex), y stored procedures en términos de mantenibilidad y portabilidad."
          ],
          exercise: {
            title: "Detectar y resolver N+1 con Prisma + EXPLAIN ANALYZE",
            description: "Implementa el esquema de e-commerce con Prisma. Activa el logging de queries para detectar N+1. Resuélvelo con include. Luego escribe la misma query con $queryRaw y compara el EXPLAIN ANALYZE de ambas versiones.",
            code: `// ❌ N+1 problem — genera 1 + N queries
const authors = await prisma.author.findMany();
for (const author of authors) {
  const books = await prisma.book.findMany({ // N queries!
    where: { authorId: author.id }
  });
  author.books = books;
}

// ✅ Eager loading — genera 1 query con JOIN
const authors = await prisma.author.findMany({
  include: { books: true }
});

// ✅ Raw query para máximo control
const result = await prisma.$queryRaw\`
  SELECT a.*, 
    json_agg(b.*) as books,
    COUNT(b.id) as book_count
  FROM authors a
  LEFT JOIN books b ON b.author_id = a.id
  GROUP BY a.id
  ORDER BY book_count DESC
\`;

// Ver el plan generado por cada versión
-- EXPLAIN ANALYZE (Prisma include):
-- Hash Join  (cost=12.50..89.23 rows=150)
-- EXPLAIN ANALYZE (raw query):
-- Merge Join (cost=8.20..45.10 rows=150) // potencialmente mejor`
          },
          keywords: ["impedance mismatch", "N+1 problem", "eager loading", "lazy loading", "migration", "schema drift", "raw query", "query builder", "data mapper pattern", "active record pattern"],
          resources: [
            { title: "Prisma Performance Tips", url: "https://www.prisma.io/docs/guides/performance-and-optimization" },
            { title: "The Vietnam of Computer Science — Ted Neward", url: "http://blogs.tedneward.com/post/the-vietnam-of-computer-science/" },
            { title: "Patterns of Enterprise Application Architecture — Martin Fowler", url: "https://martinfowler.com/books/eaa.html" }
          ]
        }
      ]
    },
    {
      id: 3,
      title: "Arquitectura, Seguridad y Sistemas Distribuidos",
      color: "#FF6B35",
      accent: "#3D1A00",
      days: [
        {
          day: 11,
          title: "Diseño de APIs Escalables y Versionado",
          concept: `Una API pública es un contrato. Cambiarlo rompe a los consumidores. Las estrategias de versionado son: URL path (/v1/users), header (API-Version: 2), o content negotiation. El problema de pagination drift con offset-based pagination es un bug clásico en sistemas con datos que cambian frecuentemente. La paginación por cursor resuelve esto pero requiere diseño más cuidadoso.`,
          questions: [
            "¿Por qué la paginación con LIMIT/OFFSET en SQL es problemática para tablas grandes? Calcula el costo de OFFSET 1000000 LIMIT 20 y explica qué hace el motor internamente. ¿Cómo la paginación por cursor lo resuelve?",
            "Si necesitas mantener compatibilidad hacia atrás, ¿cuándo es un cambio 'breaking' vs. 'non-breaking'? Classifica: añadir campo, eliminar campo, cambiar tipo de int a string, renombrar endpoint.",
            "¿Por qué el versionado por URL es considerado 'anti-RESTful' por algunos y pragmático por otros? ¿Qué argumentaría Fielding?"
          ],
          exercise: {
            title: "Paginación cursor-based con cursor opaco",
            description: "Implementa paginación cursor-based para posts ordenados por fecha. El cursor debe ser opaco (base64 del ID + timestamp), funcionar correctamente cuando se insertan nuevos posts entre páginas, y soportar orden inverso.",
            code: `// Encoder/decoder de cursor opaco
const encodeCursor = (id, createdAt) =>
  Buffer.from(JSON.stringify({ id, createdAt })).toString('base64');

const decodeCursor = (cursor) =>
  JSON.parse(Buffer.from(cursor, 'base64').toString());

async function getPosts(cursor, limit = 20, direction = 'forward') {
  let query = db('posts').orderBy('created_at', 'desc').limit(limit + 1);
  
  if (cursor) {
    const { id, createdAt } = decodeCursor(cursor);
    // Keyset pagination — usa el índice compuesto (created_at, id)
    query = query.where(function() {
      this.where('created_at', '<', createdAt)
        .orWhere(function() {
          this.where('created_at', '=', createdAt)
            .andWhere('id', '<', id);
        });
    });
  }
  
  const posts = await query;
  const hasNextPage = posts.length > limit;
  const items = hasNextPage ? posts.slice(0, -1) : posts;
  
  return {
    data: items,
    pageInfo: {
      hasNextPage,
      hasPreviousPage: !!cursor,
      startCursor: items[0] ? encodeCursor(items[0].id, items[0].created_at) : null,
      endCursor: items.at(-1) ? encodeCursor(items.at(-1).id, items.at(-1).created_at) : null
    }
  };
}`
          },
          keywords: ["cursor pagination", "keyset pagination", "offset pagination", "pagination drift", "breaking change", "semantic versioning", "backward compatibility", "hypermedia controls", "sparse fieldsets"],
          resources: [
            { title: "Stripe API Docs — referencia de diseño de API", url: "https://stripe.com/docs/api" },
            { title: "API Design Patterns — JJ Geewax (O'Reilly)", url: "https://www.oreilly.com/library/view/api-design-patterns/9781617295850/" },
            { title: "GitHub API Docs — cursor pagination real", url: "https://docs.github.com/en/rest" }
          ]
        },
        {
          day: 12,
          title: "Seguridad Backend: OWASP Top 10 en Profundidad",
          concept: `El OWASP Top 10 no es una lista de bugs, es una lista de categorías de vulnerabilidades sistémicas. Las más críticas para backend: Injection (SQL, NoSQL, Command), Broken Authentication, IDOR, Security Misconfiguration, y Cryptographic Failures. La mayoría de vulnerabilidades vienen de validación insuficiente de input y exceso de confianza en el cliente. El principio de defense in depth dice que ninguna capa de seguridad es suficiente sola.`,
          questions: [
            "SQL Injection sigue en el OWASP Top 10. Si usas un ORM con prepared statements, ¿eres completamente inmune? ¿Qué casos edge existen donde el ORM puede ser vulnerable?",
            "IDOR: tienes GET /invoices/:id con JWT. ¿Es suficiente para prevenir IDOR? ¿Qué verificación adicional es absolutamente necesaria?",
            "Explica el ataque 'timing attack' en la comparación de tokens. ¿Por qué token === storedToken en JavaScript es inseguro? ¿Cómo funciona crypto.timingSafeEqual a nivel de CPU?"
          ],
          exercise: {
            title: "Aplicación deliberadamente vulnerable + versión corregida",
            description: "Crea una app con 5 vulnerabilidades: SQL Injection, IDOR, Mass Assignment, JWT con alg:none, y stack traces en producción. Documenta el vector de ataque de cada una. Luego crea la versión corregida.",
            code: `// ❌ VULNERABLE — Mass Assignment
app.put('/users/:id', async (req, res) => {
  // Un atacante puede enviar { role: 'admin', balance: 999999 }
  await db.users.update(req.params.id, req.body); // PELIGROSO
});

// ✅ CORREGIDO — Whitelist de campos permitidos
app.put('/users/:id', async (req, res) => {
  const allowedFields = ['name', 'email', 'bio'];
  const safeData = pick(req.body, allowedFields);
  await db.users.update(req.params.id, safeData);
});

// ❌ VULNERABLE — IDOR
app.get('/invoices/:id', authenticate, async (req, res) => {
  const invoice = await db.invoices.findById(req.params.id);
  // Cualquier usuario autenticado puede ver cualquier factura!
  res.json(invoice);
});

// ✅ CORREGIDO — Verificar ownership
app.get('/invoices/:id', authenticate, async (req, res) => {
  const invoice = await db.invoices.findOne({
    id: req.params.id,
    userId: req.user.id  // Solo puede ver SUS facturas
  });
  if (!invoice) return res.status(404).json({ error: 'Not found' });
  res.json(invoice);
});

// ❌ Timing attack en comparación de tokens
if (providedToken === storedToken) { ... } // Vulnerable

// ✅ Comparación en tiempo constante
const crypto = require('crypto');
if (crypto.timingSafeEqual(
  Buffer.from(providedToken),
  Buffer.from(storedToken)
)) { ... }`
          },
          keywords: ["SQL injection", "prepared statement", "IDOR", "mass assignment", "CSRF", "XSS", "CSP", "timing attack", "defense in depth", "principle of least privilege", "security headers"],
          resources: [
            { title: "OWASP Top 10 — documentación oficial", url: "https://owasp.org/Top10" },
            { title: "PortSwigger Web Security Academy — laboratorios gratuitos", url: "https://portswigger.net/web-security" },
            { title: "OWASP ASVS — Application Security Verification Standard", url: "https://owasp.org/www-project-application-security-verification-standard/" }
          ]
        },
        {
          day: 13,
          title: "Monolito vs. Microservicios vs. Modular",
          concept: `La falacia de que "microservicios escalan mejor" ignora que introducen complejidad distribuida: latencia de red, consistencia eventual, gestión de fallos parciales, distributed tracing, y transacciones distribuidas. Un monolito bien estructurado puede escalar horizontalmente perfectamente. La decisión real es cuándo la complejidad operacional de los microservicios se justifica por la complejidad organizacional. La ley de Conway dice que la arquitectura refleja la estructura de comunicación de tu organización.`,
          questions: [
            "Si microservicio A llama a B que llama a C, y C tiene 1% de tasa de error, ¿cuál es la tasa de error total? ¿Cómo escala con 10 servicios? ¿Qué patrón resuelve esto?",
            "El patrón Saga resuelve transacciones distribuidas. ¿Cuál es la diferencia entre saga coreografiada y orquestada? ¿Cuándo cada una es preferible y cuál es más difícil de debuggear?",
            "¿Qué es la 'distributed monolith' y por qué es peor que un monolito normal Y peor que microservicios bien hechos?"
          ],
          exercise: {
            title: "Sistema de biblioteca dividido en 3 microservicios",
            description: "Divide el proyecto en auth-service, catalog-service y loan-service. Implementa comunicación síncrona (REST) para queries y asíncrona (eventos) para operaciones cross-domain. Implementa un circuit breaker básico.",
            code: `// Circuit Breaker básico
class CircuitBreaker {
  constructor(fn, threshold = 5, timeout = 60000) {
    this.fn = fn;
    this.threshold = threshold;
    this.timeout = timeout;
    this.failures = 0;
    this.state = 'CLOSED'; // CLOSED | OPEN | HALF_OPEN
    this.nextAttempt = Date.now();
  }
  
  async call(...args) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit OPEN — service unavailable');
      }
      this.state = 'HALF_OPEN';
    }
    
    try {
      const result = await this.fn(...args);
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }
  
  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failures++;
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}

// Uso
const catalogBreaker = new CircuitBreaker(
  (bookId) => catalogService.getBook(bookId)
);`
          },
          keywords: ["bounded context", "domain-driven design", "saga pattern", "two-phase commit", "circuit breaker", "service mesh", "event-driven architecture", "choreography vs. orchestration", "Conway's Law", "strangler fig pattern"],
          resources: [
            { title: "Building Microservices — Sam Newman (2da edición)", url: "https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/" },
            { title: "Microservice Trade-Offs — Martin Fowler", url: "https://martinfowler.com/articles/microservice-trade-offs.html" }
          ]
        },
        {
          day: 14,
          title: "Message Queues y Comunicación Asíncrona",
          concept: `Las colas de mensajes desacoplan productores de consumidores y hacen las operaciones resilientes a fallos. RabbitMQ usa AMQP con exchanges y queues; Kafka es un log distribuido de eventos inmutables ideal para event sourcing. RabbitMQ elimina mensajes cuando son consumidos; Kafka los retiene y permite múltiples consumidores leer el mismo evento en tiempos distintos. Los problemas operacionales incluyen: at-least-once delivery (idempotencia requerida), message ordering, dead letter queues, y consumer group lag.`,
          questions: [
            "Si tu message broker garantiza 'at-least-once delivery', ¿qué implica para el consumidor? Da un ejemplo concreto de un handler que falla si no es idempotente y uno que sí lo es.",
            "En Kafka, un consumer group con 3 consumers lee de un topic con 6 particiones. ¿Cómo se distribuye la carga? ¿Qué pasa si añades un 4to consumer? ¿Y si tienes 7 para 6 particiones?",
            "¿Cuál es la diferencia entre 'event notification', 'event-carried state transfer', y 'event sourcing'? ¿Cuándo cada patrón es el correcto?"
          ],
          exercise: {
            title: "Sistema de procesamiento de órdenes con BullMQ",
            description: "El endpoint HTTP encola la orden y responde 202 Accepted. Un worker la procesa con retry + backoff exponencial (máx 3 intentos). Fallos van a dead letter queue. Endpoint de monitoreo que muestra el estado de la cola.",
            code: `import { Queue, Worker, QueueEvents } from 'bullmq';

const orderQueue = new Queue('orders', { connection: redis });

// Producer — responde inmediatamente
app.post('/orders', async (req, res) => {
  const job = await orderQueue.add('process-order', req.body, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: false,
    removeOnFail: false
  });
  
  res.status(202).json({ 
    jobId: job.id, 
    statusUrl: \`/orders/status/\${job.id}\` 
  });
});

// Consumer — procesa en background
const worker = new Worker('orders', async (job) => {
  const { orderId, userId, items } = job.data;
  
  // Idempotency check — si ya procesamos este orden, skip
  const alreadyProcessed = await db.processedJobs.exists(job.id);
  if (alreadyProcessed) return { skipped: true };
  
  await processOrder({ orderId, userId, items });
  await db.processedJobs.insert(job.id); // Marcar como procesado
  
}, { connection: redis });

worker.on('failed', (job, err) => {
  if (job.attemptsMade >= job.opts.attempts) {
    // Mover a dead letter queue manualmente
    deadLetterQueue.add('failed-order', { 
      originalJob: job.data, 
      error: err.message 
    });
  }
});`
          },
          keywords: ["at-least-once delivery", "exactly-once delivery", "idempotency key", "dead letter queue", "consumer group", "partition", "backpressure", "event sourcing", "CQRS", "outbox pattern"],
          resources: [
            { title: "BullMQ Documentation", url: "https://docs.bullmq.io" },
            { title: "Kafka: The Definitive Guide — Narkhede et al.", url: "https://www.oreilly.com/library/view/kafka-the-definitive/9781492043072/" },
            { title: "The Many Meanings of Event-Driven Architecture — Martin Fowler", url: "https://www.youtube.com/watch?v=STKCRSUsyP0" }
          ]
        }
      ]
    },
    {
      id: 4,
      title: "Observabilidad, Performance y Producción",
      color: "#C77DFF",
      accent: "#1A0033",
      days: [
        {
          day: 15,
          title: "Logging, Métricas y Tracing (Los tres pilares)",
          concept: `La observabilidad es la capacidad de entender el estado interno de un sistema desde sus outputs externos. Los tres pilares: logs (eventos discretos con contexto), métricas (valores numéricos agregados en el tiempo), y trazas distribuidas (el recorrido de una request a través de múltiples servicios). Las métricas te dicen QUÉ está mal, los logs te dicen DÓNDE y POR QUÉ, las trazas te dicen DÓNDE en el flujo distribuido. El estándar OpenTelemetry unifica la instrumentación para los tres.`,
          questions: [
            "Structured logging (JSON) vs. unstructured logging (texto libre): ¿cuál es la diferencia práctica a la hora de hacer queries en Elasticsearch? ¿Qué campos deberían estar siempre presentes en cada log line?",
            "Si usas Prometheus para métricas, ¿cuál es la diferencia entre Counter, Gauge, Histogram y Summary? ¿Cuándo usarías Histogram sobre Summary y qué problema tiene el Summary en sistemas distribuidos?",
            "¿Qué es 'cardinality' en sistemas de métricas? ¿Por qué añadir user_id como label en Prometheus puede destruir tu sistema de métricas?"
          ],
          exercise: {
            title: "Instrumentación completa: logs + métricas + healthchecks",
            description: "Instrumenta la API con: logging estructurado (pino) con correlationId, métricas Prometheus (requests totales, latencia p50/p95/p99, requests activos), y endpoints /health y /ready que distingan liveness de readiness. Visualiza con Grafana.",
            code: `import pino from 'pino';
import promClient from 'prom-client';

// Structured logging con correlationId
const logger = pino({ level: 'info' });

const requestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5]
});

app.use((req, res, next) => {
  req.correlationId = req.headers['x-correlation-id'] || crypto.randomUUID();
  req.log = logger.child({ correlationId: req.correlationId });
  
  const end = requestDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route?.path, status_code: res.statusCode });
    req.log.info({ 
      method: req.method, 
      url: req.url, 
      statusCode: res.statusCode,
      duration: Date.now() - req.startTime
    }, 'request completed');
  });
  next();
});

// Liveness vs Readiness — conceptualmente distintos
app.get('/health', (req, res) => {
  // Liveness: ¿el proceso está vivo? Siempre 200 si el server responde
  res.json({ status: 'alive' });
});

app.get('/ready', async (req, res) => {
  // Readiness: ¿puede manejar tráfico? Verifica dependencias
  try {
    await db.query('SELECT 1');
    await redis.ping();
    res.json({ status: 'ready', checks: { db: 'ok', cache: 'ok' } });
  } catch (err) {
    res.status(503).json({ status: 'not ready', error: err.message });
  }
});`
          },
          keywords: ["structured logging", "correlation ID", "distributed tracing", "span", "trace", "OpenTelemetry", "Prometheus", "cardinality", "percentile", "p99 latency", "liveness vs. readiness", "SLO/SLI/SLA"],
          resources: [
            { title: "OpenTelemetry Documentation", url: "https://opentelemetry.io/docs/" },
            { title: "Observability Engineering — Charity Majors et al.", url: "https://www.oreilly.com/library/view/observability-engineering/9781492076438/" },
            { title: "Grafana Labs — tutoriales de dashboards", url: "https://grafana.com/tutorials/" }
          ]
        },
        {
          day: 16,
          title: "Performance: Profiling y Optimización",
          concept: `Optimizar sin medir es adivinar. El flujo correcto: detectar → medir → identificar cuello de botella → optimizar → medir de nuevo. Los cuellos de botella en backend casi siempre son: I/O de base de datos (queries lentas, N+1, sin índices), I/O de red (llamadas síncronas innecesarias, sin connection pooling), o CPU (criptografía, serialización, compresión). Entender la diferencia entre latencia y throughput, y por qué optimizar uno puede degradar el otro, es fundamental.`,
          questions: [
            "Connection pooling en bases de datos: ¿cuál es el número óptimo de conexiones? ¿Por qué tener 500 conexiones activas simultáneamente puede ser PEOR que tener 20?",
            "¿Cuál es la diferencia entre latencia P50, P95 y P99? ¿Por qué una API con P50 de 10ms puede tener P99 de 2000ms y qué causa ese tail latency?",
            "Si necesitas hacer 5 llamadas API externas independientes para construir una respuesta, ¿cuál es la diferencia en latencia entre serie vs. Promise.all? ¿Cuándo Promise.all puede ser contraproducente?"
          ],
          exercise: {
            title: "Load testing + flame graph con k6 y Clinic.js",
            description: "Usa k6 para load testing de la API. Identifica el punto de quiebre (RPS donde P99 > 1s). Usa Clinic.js para generar un flame graph y localizar la función más costosa. Implementa connection pooling y mide el impacto.",
            code: `// k6 load test script
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },   // Ramp up
    { duration: '3m', target: 50 },   // Steady state
    { duration: '1m', target: 200 },  // Stress
    { duration: '1m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(99)<1000'], // P99 < 1s
    http_req_failed: ['rate<0.01'],    // Error rate < 1%
  },
};

export default function() {
  const res = http.get('http://localhost:3000/books');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}

// pg-pool configuration óptima
// Fórmula: connections = (num_cores * 2) + effective_spindle_count
const pool = new Pool({
  max: 20,          // No más de 20 conexiones
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Generar flame graph:
// clinic flame -- node server.js`
          },
          keywords: ["flame graph", "connection pool", "throughput", "latency", "tail latency", "p99", "load testing", "stress testing", "soak testing", "backpressure", "event loop lag", "GC pressure"],
          resources: [
            { title: "Clinic.js — profiling de Node.js con flame graphs", url: "https://clinicjs.org" },
            { title: "k6 Documentation — load testing", url: "https://k6.io/docs/" },
            { title: "Systems Performance — Brendan Gregg", url: "https://www.brendangregg.com/systems-performance-2nd-edition-book.html" }
          ]
        },
        {
          day: 17,
          title: "Contenedores, Docker y el Entorno de Producción",
          concept: `Docker no es solo "para deployar". Entender el sistema de capas de imágenes, el copy-on-write filesystem, y los namespaces de Linux que hacen posible el aislamiento es esencial para escribir Dockerfiles eficientes. Un Dockerfile mal escrito genera imágenes de 2GB; uno bien escrito genera imágenes de 100MB. Técnicas clave: multi-stage builds, orden de capas para aprovechar el cache, usuario no-root, y variables de entorno vs. secrets.`,
          questions: [
            "Cada instrucción RUN, COPY, ADD en un Dockerfile crea una nueva capa. ¿Por qué el orden de las instrucciones COPY importa para el cache? ¿Qué pasaría si copias todo el código antes de instalar dependencias?",
            "¿Qué diferencia hay entre CMD y ENTRYPOINT en un Dockerfile? ¿Cuándo usarías cada uno y cuál es el comportamiento cuando ambos están presentes?",
            "Si tu aplicación Node.js corre como PID 1 en el contenedor y recibe SIGTERM, ¿qué puede pasar si no manejas la señal? ¿Qué es 'graceful shutdown' y por qué es crítico para no perder requests en vuelo?"
          ],
          exercise: {
            title: "Dockerfile optimizado con multi-stage build",
            description: "Crea un Dockerfile con multi-stage build (build stage + producción alpine). Debe: correr como usuario no-root, implementar healthcheck, y el tiempo de rebuild en cambios de código debe ser < 10s gracias al cache. Incluye docker-compose con PostgreSQL y Redis.",
            code: `# Multi-stage Dockerfile optimizado
# Stage 1: Dependencies (se cachea si package.json no cambia)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./  # Solo el manifest primero
RUN npm ci --only=production            # Instala deps (cacheado)

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .                                # Código fuente (invalida cache solo aquí)
RUN npm run build

# Stage 3: Production (imagen mínima)
FROM node:20-alpine AS runner
WORKDIR /app

# Crear usuario no-root
RUN addgroup --system nodejs && adduser --system --ingroup nodejs nodejs

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

USER nodejs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \\
  CMD wget -qO- http://localhost:3000/health || exit 1

# Graceful shutdown handler en app.js
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await db.end();
    await redis.quit();
    process.exit(0);
  });
  // Force kill after 30s
  setTimeout(() => process.exit(1), 30000);
});`
          },
          keywords: ["layer caching", "multi-stage build", "distroless", "alpine", "SIGTERM", "graceful shutdown", "PID 1", "healthcheck", "build context", "secrets vs. env vars", "namespaces", "cgroups"],
          resources: [
            { title: "Docker Best Practices — documentación oficial", url: "https://docs.docker.com/develop/dev-best-practices/" },
            { title: "Docker Deep Dive — Nigel Poulton", url: "https://www.nigelpoulton.com/books/docker-deep-dive/" },
            { title: "Terminus — Graceful shutdown library", url: "https://github.com/godaddy/terminus" }
          ]
        },
        {
          day: 18,
          title: "Testing en Backend: más allá del unit test",
          concept: `Para backend, los integration tests (que prueban el comportamiento de un endpoint contra una base de datos real) dan más confianza que los unit tests de lógica aislada. Los mocks son una herramienta poderosa pero mal usada: si mockeas demasiado, estás probando que tu mock funciona, no que tu código funciona. Contract testing (Pact) resuelve el problema de verificar que dos servicios son compatibles sin levantar el sistema completo.`,
          questions: [
            "¿Cuándo un mock es la herramienta correcta y cuándo es una señal de mal diseño? Si necesitas mockear 5 dependencias para testear una función, ¿qué dice eso sobre el diseño?",
            "Los tests de integración que usan una base de datos real son lentos. ¿Cómo aislas el estado entre tests? Compara transactions/rollback vs. datos fixtures vs. database-per-test.",
            "¿Qué es el contract testing y cómo resuelve el problema de que frontend y backend estén desarrollando en paralelo? ¿En qué se diferencia de una integration test normal?"
          ],
          exercise: {
            title: "Suite de integration tests con aislamiento por transacción",
            description: "Escribe integration tests para la API de biblioteca con Jest + Supertest + PostgreSQL de test. Cada test corre en una transacción que se hace rollback al final. Añade un contract test que falle si el response shape cambia. Corre en CI con GitHub Actions.",
            code: `// jest.setup.js — Transacción por test para aislamiento
let client;
let transactionSavepoint;

beforeAll(async () => {
  client = await pool.connect();
});

beforeEach(async () => {
  await client.query('BEGIN');
  // Savepoint para poder hacer rollback sin cerrar la transacción
  await client.query('SAVEPOINT test_start');
});

afterEach(async () => {
  // Rollback después de CADA test — aislamiento perfecto
  await client.query('ROLLBACK TO SAVEPOINT test_start');
});

afterAll(async () => {
  await client.query('ROLLBACK');
  client.release();
});

// Integration test real
describe('GET /books', () => {
  it('returns books with correct shape', async () => {
    // Insertar datos de test (se revertirán automáticamente)
    await client.query(
      "INSERT INTO books (title, author) VALUES ('Clean Code', 'Martin')"
    );
    
    const res = await request(app).get('/books');
    
    expect(res.status).toBe(200);
    // Contract test — el shape nunca puede cambiar
    expect(res.body[0]).toMatchObject({
      id: expect.any(Number),
      title: expect.any(String),
      author: expect.any(String),
      // Si alguien elimina 'author', este test falla
    });
  });
});`
          },
          keywords: ["integration test", "contract testing", "test isolation", "test double", "mock vs. stub vs. spy", "test pyramid", "property-based testing", "snapshot testing", "test coverage", "mutation testing"],
          resources: [
            { title: "Pact — contract testing framework", url: "https://pact.io" },
            { title: "Testcontainers — contenedores para integration tests", url: "https://testcontainers.com" },
            { title: "Unit Testing: Principles, Practices, and Patterns — Khorikov", url: "https://www.manning.com/books/unit-testing" }
          ]
        },
        {
          day: 19,
          title: "CI/CD, Deployment Strategies y el camino a producción",
          concept: `CI/CD es una práctica que reduce el riesgo de cada cambio. Blue/Green permite rollback instantáneo pero requiere el doble de infraestructura; Canary expone gradualmente el cambio pero requiere feature flags y observabilidad; Rolling updates son simples pero pueden dejar dos versiones corriendo simultáneamente. Las database migrations son el punto más delgado: un ALTER TABLE en una tabla de millones de rows puede bloquear la aplicación.`,
          questions: [
            "Tu aplicación tiene una tabla con 100M rows y necesitas añadir una columna NOT NULL sin valor default. ¿Por qué esto puede hacer caer producción? ¿Cuál es el proceso correcto en múltiples pasos para hacerlo sin downtime?",
            "En un deployment Blue/Green, ¿qué pasa con las sessions o websockets activos en Blue cuando cambias el tráfico a Green? ¿Cómo lo manejas?",
            "¿Qué es 'trunk-based development' y por qué es considerado una práctica de élite para CI/CD? ¿Cómo funciona con feature flags para evitar ramas de larga duración?"
          ],
          exercise: {
            title: "Pipeline CI/CD completo con GitHub Actions",
            description: "Crea un pipeline que: ejecute los integration tests del Día 18, haga build de la imagen Docker, la publique a GitHub Container Registry, y haga deploy automático a Railway/Render en cada push a main. Implementa un smoke test post-deployment.",
            code: `# .github/workflows/deploy.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
        options: --health-cmd pg_isready
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm test
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/test

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/\${{ github.repository }}:latest
          cache-from: type=gha  # GitHub Actions cache
          cache-to: type=gha,mode=max

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Railway
        run: railway up --detach
        env:
          RAILWAY_TOKEN: \${{ secrets.RAILWAY_TOKEN }}
      
      # Smoke test post-deployment
      - name: Smoke test
        run: |
          sleep 30  # Esperar que levante
          curl -f https://my-api.railway.app/health || exit 1`
          },
          keywords: ["blue/green deployment", "canary deployment", "rolling update", "feature flag", "zero-downtime migration", "trunk-based development", "semantic release", "deployment pipeline", "smoke test", "rollback strategy"],
          resources: [
            { title: "Continuous Delivery — Jez Humble & David Farley", url: "https://continuousdelivery.com" },
            { title: "Accelerate — Nicole Forsgren et al. (métricas DORA)", url: "https://itrevolution.com/book/accelerate/" },
            { title: "GitHub Actions Documentation", url: "https://docs.github.com/en/actions" }
          ]
        }
      ]
    }
  ]
};

export default function BackendProgram() {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  const [activeTab, setActiveTab] = useState("concept");
  const [expandedKeyword, setExpandedKeyword] = useState(null);

  const week = data.weeks[selectedWeek];
  const day = week.days[selectedDay];

  const tabs = [
    { id: "concept", label: "📖 Concepto" },
    { id: "questions", label: "🔥 Preguntas Críticas" },
    { id: "exercise", label: "⚡ Ejercicio" },
    { id: "keywords", label: "🔑 Keywords" },
    { id: "resources", label: "📚 Recursos" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#19133f",
      color: "#E8E8F0",
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1E1E2E",
        padding: "20px 32px",
        background: "linear-gradient(135deg, #0A0A0F 0%, #0F0F1E 100%)",
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}>
        <div style={{
          width: "40px", height: "40px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #00D4FF, #C77DFF)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px",
        }}>⚙</div>
        <div>
          <div style={{ fontSize: "18px", fontWeight: "700", letterSpacing: "0.05em", color: "#fff" }}>
            BACKEND MASTERY
          </div>
          <div style={{ fontSize: "11px", color: "#555", letterSpacing: "0.1em" }}>
            PROGRAMA INTENSIVO · 4 SEMANAS · 1–2 HRS/DÍA
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
          {data.weeks.map((w, i) => (
            <div key={i} style={{
              fontSize: "10px", letterSpacing: "0.08em",
              padding: "4px 10px", borderRadius: "4px",
              cursor: "pointer",
              border: `1px solid ${selectedWeek === i ? w.color : "#1E1E2E"}`,
              color: selectedWeek === i ? w.color : "#444",
              background: selectedWeek === i ? `${w.color}15` : "transparent",
              transition: "all 0.2s",
            }} onClick={() => { setSelectedWeek(i); setSelectedDay(0); setActiveTab("concept"); }}>
              W{w.id}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <div style={{
          width: "260px",
          borderRight: "1px solid #1E1E2E",
          padding: "24px 0",
          flexShrink: 0,
          overflowY: "auto",
        }}>
          {/* Week Info */}
          <div style={{ padding: "0 20px 20px", borderBottom: "1px solid #1E1E2E" }}>
            <div style={{
              fontSize: "10px", letterSpacing: "0.12em",
              color: week.color, marginBottom: "6px", fontWeight: "600"
            }}>
              SEMANA {week.id}
            </div>
            <div style={{ fontSize: "13px", color: "#BCC", lineHeight: "1.4" }}>
              {week.title}
            </div>
          </div>

          {/* Days */}
          <div style={{ padding: "16px 0" }}>
            {week.days.map((d, i) => (
              <div
                key={i}
                onClick={() => { setSelectedDay(i); setActiveTab("concept"); }}
                style={{
                  padding: "12px 20px",
                  cursor: "pointer",
                  borderLeft: selectedDay === i ? `3px solid ${week.color}` : "3px solid transparent",
                  background: selectedDay === i ? `${week.color}08` : "transparent",
                  transition: "all 0.15s",
                }}
              >
                <div style={{
                  fontSize: "10px", color: selectedDay === i ? week.color : "#444",
                  letterSpacing: "0.1em", marginBottom: "4px"
                }}>
                  DÍA {d.day}
                </div>
                <div style={{
                  fontSize: "12px",
                  color: selectedDay === i ? "#E8E8F0" : "#666",
                  lineHeight: "1.4",
                }}>
                  {d.title}
                </div>
              </div>
            ))}
          </div>

          {/* Week navigation */}
          <div style={{
            padding: "16px 20px 0",
            borderTop: "1px solid #1E1E2E",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}>
            {data.weeks.map((w, i) => (
              <div
                key={i}
                onClick={() => { setSelectedWeek(i); setSelectedDay(0); setActiveTab("concept"); }}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  border: `1px solid ${selectedWeek === i ? w.color : "#1E1E2E"}`,
                  background: selectedWeek === i ? `${w.color}10` : "transparent",
                  transition: "all 0.2s",
                }}
              >
                <div style={{
                  fontSize: "10px",
                  color: selectedWeek === i ? w.color : "#444",
                  letterSpacing: "0.08em",
                }}>
                  S{w.id} — {w.title.substring(0, 30)}...
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Day Header */}
          <div style={{
            padding: "24px 32px",
            borderBottom: "1px solid #1E1E2E",
            background: `linear-gradient(135deg, ${week.color}08 0%, transparent 100%)`,
          }}>
            <div style={{
              fontSize: "11px", letterSpacing: "0.15em",
              color: week.color, marginBottom: "8px", fontWeight: "600"
            }}>
              DÍA {day.day} · SEMANA {week.id}
            </div>
            <div style={{
              fontSize: "22px", fontWeight: "700",
              color: "#FFFFFF", lineHeight: "1.2",
            }}>
              {day.title}
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: "flex",
            borderBottom: "1px solid #1E1E2E",
            padding: "0 32px",
            overflowX: "auto",
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "14px 18px",
                  background: "none",
                  border: "none",
                  borderBottom: activeTab === tab.id ? `2px solid ${week.color}` : "2px solid transparent",
                  color: activeTab === tab.id ? week.color : "#444",
                  cursor: "pointer",
                  fontSize: "12px",
                  letterSpacing: "0.05em",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                  marginBottom: "-1px",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>

            {/* CONCEPT TAB */}
            {activeTab === "concept" && (
              <div style={{ maxWidth: "780px" }}>
                <div style={{
                  padding: "24px",
                  borderRadius: "10px",
                  border: `1px solid ${week.color}30`,
                  background: `${week.color}05`,
                  lineHeight: "1.8",
                  fontSize: "14px",
                  color: "#CCC",
                }}>
                  {day.concept}
                </div>
              </div>
            )}

            {/* QUESTIONS TAB */}
            {activeTab === "questions" && (
              <div style={{ maxWidth: "780px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{
                  fontSize: "11px", color: "#444", letterSpacing: "0.1em", marginBottom: "8px"
                }}>
                  PREGUNTAS DE NIVEL CRÍTICO — No busques la respuesta rápida. Razona.
                </div>
                {day.questions.map((q, i) => (
                  <div key={i} style={{
                    padding: "20px 24px",
                    borderRadius: "8px",
                    border: "1px solid #1E1E2E",
                    background: "#0D0D18",
                    display: "flex",
                    gap: "16px",
                  }}>
                    <div style={{
                      width: "28px", height: "28px",
                      borderRadius: "6px",
                      background: `${week.color}20`,
                      border: `1px solid ${week.color}40`,
                      color: week.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "12px", fontWeight: "700", flexShrink: 0,
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ fontSize: "13px", color: "#CCC", lineHeight: "1.7" }}>
                      {q}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* EXERCISE TAB */}
            {activeTab === "exercise" && (
              <div style={{ maxWidth: "900px" }}>
                <div style={{
                  marginBottom: "20px",
                  padding: "16px 24px",
                  borderRadius: "8px",
                  border: `1px solid ${week.color}30`,
                  background: `${week.color}08`,
                }}>
                  <div style={{
                    fontSize: "14px", fontWeight: "700",
                    color: week.color, marginBottom: "8px"
                  }}>
                    ⚡ {day.exercise.title}
                  </div>
                  <div style={{ fontSize: "13px", color: "#999", lineHeight: "1.6" }}>
                    {day.exercise.description}
                  </div>
                </div>
                <div style={{
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid #1E1E2E",
                }}>
                  <div style={{
                    padding: "10px 16px",
                    background: "#0D0D18",
                    borderBottom: "1px solid #1E1E2E",
                    fontSize: "11px",
                    color: "#444",
                    letterSpacing: "0.1em",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FF5F56" }}/>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FFBD2E" }}/>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#27C93F" }}/>
                    <span style={{ marginLeft: "8px" }}>CODE EXAMPLE</span>
                  </div>
                  <pre style={{
                    padding: "24px",
                    margin: 0,
                    fontSize: "12px",
                    lineHeight: "1.7",
                    color: "#A8B4C8",
                    background: "#080810",
                    overflowX: "auto",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}>
                    {day.exercise.code}
                  </pre>
                </div>
              </div>
            )}

            {/* KEYWORDS TAB */}
            {activeTab === "keywords" && (
              <div style={{ maxWidth: "780px" }}>
                <div style={{
                  fontSize: "11px", color: "#444", letterSpacing: "0.1em", marginBottom: "20px"
                }}>
                  DOMINA ESTOS CONCEPTOS — Debes poder explicarlos sin dudar
                </div>
                <div style={{
                  display: "flex", flexWrap: "wrap", gap: "10px"
                }}>
                  {day.keywords.map((kw, i) => (
                    <div
                      key={i}
                      onClick={() => setExpandedKeyword(expandedKeyword === kw ? null : kw)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "6px",
                        border: `1px solid ${expandedKeyword === kw ? week.color : "#1E1E2E"}`,
                        background: expandedKeyword === kw ? `${week.color}15` : "#0D0D18",
                        color: expandedKeyword === kw ? week.color : "#888",
                        fontSize: "12px",
                        cursor: "pointer",
                        letterSpacing: "0.05em",
                        transition: "all 0.15s",
                        fontWeight: expandedKeyword === kw ? "600" : "400",
                      }}
                    >
                      {kw}
                    </div>
                  ))}
                </div>
                {expandedKeyword && (
                  <div style={{
                    marginTop: "20px",
                    padding: "16px 20px",
                    borderRadius: "8px",
                    border: `1px solid ${week.color}30`,
                    background: `${week.color}05`,
                    fontSize: "12px",
                    color: "#999",
                  }}>
                    <span style={{ color: week.color, fontWeight: "600" }}>{expandedKeyword}</span>
                    {" "}— Seleccionado. Busca este término en el contexto del concepto del día para comprenderlo en profundidad.
                  </div>
                )}
                {/* All keywords summary */}
                <div style={{ marginTop: "32px" }}>
                  <div style={{
                    fontSize: "11px", color: "#333", letterSpacing: "0.1em", marginBottom: "12px"
                  }}>
                    TODAS LAS KEYWORDS DEL PROGRAMA
                  </div>
                  {data.weeks.map((w, wi) => (
                    <div key={wi} style={{ marginBottom: "16px" }}>
                      <div style={{
                        fontSize: "10px", color: w.color,
                        letterSpacing: "0.1em", marginBottom: "8px"
                      }}>
                        SEMANA {w.id} — {w.title}
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {[...new Set(w.days.flatMap(d => d.keywords))].map((kw, i) => (
                          <span key={i} style={{
                            padding: "3px 8px",
                            borderRadius: "3px",
                            background: `${w.color}10`,
                            border: `1px solid ${w.color}20`,
                            color: `${w.color}99`,
                            fontSize: "10px",
                            letterSpacing: "0.05em",
                          }}>
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RESOURCES TAB */}
            {activeTab === "resources" && (
              <div style={{ maxWidth: "780px" }}>
                <div style={{
                  fontSize: "11px", color: "#444", letterSpacing: "0.1em", marginBottom: "20px"
                }}>
                  RECURSOS COMPLEMENTARIOS
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {day.resources.map((r, i) => (
                    <a
                      key={i}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "16px 20px",
                        borderRadius: "8px",
                        border: "1px solid #1E1E2E",
                        background: "#0D0D18",
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        textDecoration: "none",
                        transition: "all 0.2s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = `${week.color}50`;
                        e.currentTarget.style.background = `${week.color}05`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "#1E1E2E";
                        e.currentTarget.style.background = "#0D0D18";
                      }}
                    >
                      <div style={{
                        width: "32px", height: "32px",
                        borderRadius: "6px",
                        background: `${week.color}15`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "14px", flexShrink: 0,
                      }}>
                        📎
                      </div>
                      <div>
                        <div style={{ fontSize: "13px", color: "#CCC", marginBottom: "3px" }}>
                          {r.title}
                        </div>
                        <div style={{ fontSize: "11px", color: "#444" }}>
                          {r.url}
                        </div>
                      </div>
                      <div style={{ marginLeft: "auto", color: "#333", fontSize: "16px" }}>→</div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div style={{
        borderTop: "1px solid #1E1E2E",
        padding: "14px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#080810",
      }}>
        <button
          onClick={() => {
            if (selectedDay > 0) { setSelectedDay(selectedDay - 1); setActiveTab("concept"); }
            else if (selectedWeek > 0) {
              setSelectedWeek(selectedWeek - 1);
              setSelectedDay(data.weeks[selectedWeek - 1].days.length - 1);
              setActiveTab("concept");
            }
          }}
          disabled={selectedWeek === 0 && selectedDay === 0}
          style={{
            padding: "8px 18px",
            borderRadius: "6px",
            border: "1px solid #1E1E2E",
            background: "transparent",
            color: selectedWeek === 0 && selectedDay === 0 ? "#2A2A3A" : "#666",
            cursor: selectedWeek === 0 && selectedDay === 0 ? "not-allowed" : "pointer",
            fontSize: "12px",
            letterSpacing: "0.05em",
          }}
        >
          ← Anterior
        </button>

        <div style={{ fontSize: "11px", color: "#333", letterSpacing: "0.1em" }}>
          DÍA {day.day} DE 19 · SEMANA {week.id} DE 4
        </div>

        <button
          onClick={() => {
            const lastDay = selectedDay === week.days.length - 1;
            const lastWeek = selectedWeek === data.weeks.length - 1;
            if (!lastDay) { setSelectedDay(selectedDay + 1); setActiveTab("concept"); }
            else if (!lastWeek) { setSelectedWeek(selectedWeek + 1); setSelectedDay(0); setActiveTab("concept"); }
          }}
          disabled={selectedWeek === data.weeks.length - 1 && selectedDay === week.days.length - 1}
          style={{
            padding: "8px 18px",
            borderRadius: "6px",
            border: `1px solid ${week.color}40`,
            background: `${week.color}10`,
            color: week.color,
            cursor: "pointer",
            fontSize: "12px",
            letterSpacing: "0.05em",
          }}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
