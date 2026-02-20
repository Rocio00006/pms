import { useState, useEffect } from "react";

/* ─── DESIGN TOKENS ─── */
const T = {
  bg:       "#faf7f2",
  bgDeep:   "#f3ede3",
  panel:    "#ffffff",
  border:   "#e2d9cc",
  borderDk: "#c9bfb0",
  ink:      "#2d2416",
  inkMid:   "#6b5c47",
  inkFaint: "#a0917e",
  amber:    "#d97706",
  amberLt:  "#fef3c7",
  terra:    "#b45309",
  green:    "#166534",
  greenLt:  "#dcfce7",
  blue:     "#1e40af",
  blueLt:   "#dbeafe",
  red:      "#991b1b",
  redLt:    "#fee2e2",
  violet:   "#5b21b6",
  violetLt: "#ede9fe",
  code:     "#1e1b14",
  codeFg:   "#e8dfc8",
};

/* ─── CURRICULUM DATA ─── */
const MODULES = [
  {
    id: 1,
    emoji: "🗂️",
    title: "Fundamentos del Modelo Relacional",
    subtitle: "Entender antes de escribir",
    color: T.amber,
    colorLt: T.amberLt,
    xp: 80,
    tag: "BASES",
    lessons: [
      {
        id: "1-1",
        type: "concept",
        title: "¿Qué es una base de datos relacional?",
        duration: "10 min",
        content: `Una base de datos relacional organiza la información en **tablas** (también llamadas relaciones). Cada tabla tiene:

- **Filas** (tuplas): representan un registro individual. Ej: un cliente, un producto.
- **Columnas** (atributos): representan una característica. Ej: nombre, precio, fecha.
- **Primary Key (PK)**: valor único que identifica cada fila. Nunca puede ser NULL ni repetirse.
- **Foreign Key (FK)**: columna que referencia la PK de otra tabla, creando una relación.

**¿Por qué relacional?**
Porque los datos se relacionan entre sí. Un pedido pertenece a un cliente; un empleado pertenece a un departamento. Normalizar estos datos evita duplicación y mantiene consistencia.

**Ejemplo básico:**
\`\`\`sql
-- Tabla de clientes
CREATE TABLE clientes (
  id        SERIAL PRIMARY KEY,
  nombre    VARCHAR(100) NOT NULL,
  email     VARCHAR(150) UNIQUE NOT NULL,
  creado_en TIMESTAMPTZ  DEFAULT NOW()
);

-- Tabla de pedidos (referencia a clientes)
CREATE TABLE pedidos (
  id          SERIAL PRIMARY KEY,
  cliente_id  INT NOT NULL REFERENCES clientes(id),
  total       NUMERIC(10,2) NOT NULL,
  fecha       DATE DEFAULT CURRENT_DATE
);
\`\`\`

**Conceptos de integridad:**
- **NOT NULL**: la columna debe tener un valor siempre.
- **UNIQUE**: no puede haber dos filas con el mismo valor en esa columna.
- **CHECK**: valida que el valor cumpla una condición.
- **DEFAULT**: valor automático si no se especifica uno.`,
      },
      {
        id: "1-2",
        type: "concept",
        title: "Tipos de datos esenciales en PostgreSQL",
        duration: "12 min",
        content: `PostgreSQL tiene uno de los sistemas de tipos más ricos. Los más usados:

**Texto:**
\`\`\`sql
VARCHAR(n)   -- texto de hasta n caracteres (ej: nombres)
TEXT         -- texto de largo ilimitado (ej: descripciones, notas)
CHAR(n)      -- texto de exactamente n caracteres (raramente útil)
\`\`\`

**Números:**
\`\`\`sql
SMALLINT     -- entero pequeño (-32k a 32k)
INTEGER      -- entero común (-2B a 2B)  
BIGINT       -- entero grande (recomendado para IDs de tablas grandes)
SERIAL       -- entero autoincremental (atajo para secuencias)
BIGSERIAL    -- bigint autoincremental
NUMERIC(p,s) -- decimal exacto. p=dígitos totales, s=decimales. Ideal para dinero
FLOAT/REAL   -- decimales aproximados (no uses para dinero)
\`\`\`

**Fechas y tiempos:**
\`\`\`sql
DATE         -- solo fecha: '2024-03-15'
TIME         -- solo hora: '14:30:00'
TIMESTAMP    -- fecha + hora sin zona horaria
TIMESTAMPTZ  -- fecha + hora CON zona horaria (recomendado siempre)
INTERVAL     -- duración: '3 days', '2 hours 30 minutes'
\`\`\`

**Otros muy útiles:**
\`\`\`sql
BOOLEAN      -- TRUE / FALSE / NULL
UUID         -- identificador único universal
JSONB        -- JSON binario (búsquedas rápidas)
ARRAY        -- arreglo de cualquier tipo: INTEGER[], TEXT[]
\`\`\`

**Regla de oro:** Para dinero usa NUMERIC, nunca FLOAT. Para fechas con hora usa TIMESTAMPTZ. Para IDs en tablas grandes usa BIGSERIAL.`,
      },
      {
        id: "1-3",
        type: "exercise",
        title: "Mini-proyecto: Diseña tu primer esquema",
        duration: "20 min",
        scenario: `Vas a diseñar el esquema de una **librería en línea**. 

El sistema necesita registrar:
- Libros (título, ISBN único, precio, año de publicación, descripción)
- Autores (nombre, país, bio corta)
- Un libro puede tener múltiples autores y un autor puede tener múltiples libros
- Clientes (nombre, email único, fecha de registro)
- Órdenes de compra (cliente, fecha, estado)
- Cada orden tiene uno o varios libros (con cantidad y precio al momento de la compra)

**Tarea:** Escribe el CREATE TABLE de todas las tablas necesarias. Piensa en las claves primarias, foráneas y restricciones apropiadas.`,
        hint: `Recuerda: cuando hay una relación muchos-a-muchos (como libros-autores), necesitas una tabla intermedia. Lo mismo para orden-libros. El precio en la línea de orden debe guardarse aunque el libro cambie de precio después.`,
        solution: `-- Autores
CREATE TABLE autores (
  id      BIGSERIAL PRIMARY KEY,
  nombre  VARCHAR(150) NOT NULL,
  pais    VARCHAR(80),
  bio     TEXT
);

-- Libros
CREATE TABLE libros (
  id         BIGSERIAL PRIMARY KEY,
  titulo     VARCHAR(300) NOT NULL,
  isbn       VARCHAR(20) UNIQUE NOT NULL,
  precio     NUMERIC(8,2) NOT NULL CHECK (precio >= 0),
  ano_pub    SMALLINT CHECK (ano_pub BETWEEN 1000 AND 2100),
  descripcion TEXT
);

-- Relación muchos-a-muchos libros-autores
CREATE TABLE libros_autores (
  libro_id  BIGINT NOT NULL REFERENCES libros(id) ON DELETE CASCADE,
  autor_id  BIGINT NOT NULL REFERENCES autores(id) ON DELETE CASCADE,
  PRIMARY KEY (libro_id, autor_id)
);

-- Clientes
CREATE TABLE clientes (
  id          BIGSERIAL PRIMARY KEY,
  nombre      VARCHAR(150) NOT NULL,
  email       VARCHAR(200) UNIQUE NOT NULL,
  registrado  TIMESTAMPTZ DEFAULT NOW()
);

-- Órdenes
CREATE TABLE ordenes (
  id          BIGSERIAL PRIMARY KEY,
  cliente_id  BIGINT NOT NULL REFERENCES clientes(id),
  fecha       TIMESTAMPTZ DEFAULT NOW(),
  estado      VARCHAR(20) NOT NULL DEFAULT 'pendiente'
                CHECK (estado IN ('pendiente','pagada','enviada','cancelada'))
);

-- Líneas de orden (precio congelado al momento de la compra)
CREATE TABLE orden_items (
  id          BIGSERIAL PRIMARY KEY,
  orden_id    BIGINT NOT NULL REFERENCES ordenes(id) ON DELETE CASCADE,
  libro_id    BIGINT NOT NULL REFERENCES libros(id),
  cantidad    SMALLINT NOT NULL DEFAULT 1 CHECK (cantidad > 0),
  precio_unit NUMERIC(8,2) NOT NULL  -- precio al momento de compra
);`,
        keyPoints: [
          "ON DELETE CASCADE borra los items cuando se borra la orden padre",
          "El CHECK en estado reemplaza una tabla de lookup para valores fijos pequeños",
          "Guardar precio_unit en orden_items congela el precio histórico — patrón muy común",
          "PK compuesta (libro_id, autor_id) garantiza que no se duplique la relación",
        ],
      },
      {
        id: "1-4",
        type: "quiz",
        title: "Quiz: Modelo relacional",
        questions: [
          {
            q: "¿Cuál es la diferencia entre PRIMARY KEY y UNIQUE?",
            opts: [
              "No hay diferencia, son equivalentes",
              "PRIMARY KEY implica UNIQUE + NOT NULL, y solo puede haber una por tabla. UNIQUE puede repetirse y admite NULLs",
              "UNIQUE es para strings, PRIMARY KEY para números",
              "PRIMARY KEY no puede usarse con SERIAL",
            ],
            correct: 1,
            explain: "Una tabla solo puede tener una PRIMARY KEY, que automáticamente es UNIQUE y NOT NULL. Puede tener múltiples columnas UNIQUE, y estas sí admiten NULL (aunque NULL ≠ NULL en SQL, así que dos NULLs no se consideran duplicados).",
          },
          {
            q: "¿Qué tipo de dato usarías para almacenar el saldo de una cuenta bancaria?",
            opts: ["FLOAT", "DOUBLE PRECISION", "NUMERIC(15,2)", "INTEGER"],
            correct: 2,
            explain: "FLOAT y DOUBLE son aproximaciones de punto flotante — pueden acumular errores de redondeo. NUMERIC(15,2) almacena decimales exactos, fundamental en operaciones financieras.",
          },
          {
            q: "Tienes estudiantes y materias, un estudiante puede cursar varias materias y una materia puede tener varios estudiantes. ¿Qué estructura de tablas necesitas?",
            opts: [
              "Dos tablas: estudiantes y materias, con un array de IDs en cada una",
              "Tres tablas: estudiantes, materias, y una tabla intermedia estudiantes_materias",
              "Una sola tabla con columnas para ambas entidades",
              "Dos tablas con FK en materias apuntando a estudiantes",
            ],
            correct: 1,
            explain: "La relación muchos-a-muchos requiere una tabla intermedia (junction table). Guardar arrays de IDs viola la primera forma normal y hace las consultas muy difíciles. La tabla intermedia es el patrón correcto.",
          },
        ],
      },
    ],
    resources: [
      {
        type: "book",
        icon: "📖",
        title: "Learning SQL — Alan Beaulieu",
        detail: "Capítulos 1-3: introducción al modelo relacional, tipos de datos y creación de tablas. Libro gratuito en O'Reilly con cuenta de biblioteca.",
        url: "https://www.oreilly.com/library/view/learning-sql-3rd/9781492057604/",
      },
      {
        type: "video",
        icon: "🎬",
        title: "Database Design Course — freeCodeCamp",
        detail: "Las primeras 2 horas cubren entidades, relaciones y normalización con ejemplos visuales muy claros.",
        url: "https://www.youtube.com/watch?v=ztHopE5Wnpc",
      },
      {
        type: "practice",
        icon: "💻",
        title: "PostgreSQL Tutorial — postgresqltutorial.com",
        detail: "Sección 'Getting Started': instalar PostgreSQL, crear una base de datos y ejecutar tus primeras queries.",
        url: "https://www.postgresqltutorial.com/",
      },
    ],
  },

  {
    id: 2,
    emoji: "🔍",
    title: "SELECT: El arte de consultar datos",
    subtitle: "Filtrar, ordenar y transformar",
    color: "#0369a1",
    colorLt: "#e0f2fe",
    xp: 100,
    tag: "CONSULTAS",
    lessons: [
      {
        id: "2-1",
        type: "concept",
        title: "SELECT profundo: más allá de SELECT *",
        duration: "15 min",
        content: `**SELECT *** es cómodo pero problemático en producción. Aprende a ser preciso:

\`\`\`sql
-- ❌ Evitar en producción
SELECT * FROM clientes;

-- ✅ Especifica qué necesitas
SELECT id, nombre, email FROM clientes;
\`\`\`

**Alias con AS:**
\`\`\`sql
SELECT 
  nombre AS cliente_nombre,
  email  AS correo,
  UPPER(nombre) AS nombre_mayusculas,
  EXTRACT(YEAR FROM creado_en) AS ano_registro
FROM clientes;
\`\`\`

**Expresiones calculadas:**
\`\`\`sql
SELECT 
  titulo,
  precio,
  precio * 1.16 AS precio_con_iva,
  ROUND(precio * 0.90, 2) AS precio_descuento_10pct
FROM productos;
\`\`\`

**WHERE: filtros simples y compuestos:**
\`\`\`sql
-- Comparaciones: =, !=, <>, <, >, <=, >=
-- Lógica: AND, OR, NOT
-- Rangos: BETWEEN, NOT BETWEEN
-- Listas: IN, NOT IN
-- Nulos: IS NULL, IS NOT NULL
-- Texto: LIKE, ILIKE (case-insensitive)

SELECT * FROM productos
WHERE precio BETWEEN 10 AND 50
  AND categoria IN ('libros', 'papelería')
  AND descripcion IS NOT NULL
  AND nombre ILIKE '%python%';  -- busca "python" sin importar mayúsculas
\`\`\`

**ORDER BY y LIMIT:**
\`\`\`sql
SELECT nombre, precio
FROM productos
ORDER BY precio DESC, nombre ASC
LIMIT 10
OFFSET 20;  -- para paginación: salta los primeros 20
\`\`\`

**CASE WHEN (if-else en SQL):**
\`\`\`sql
SELECT 
  nombre,
  precio,
  CASE 
    WHEN precio < 20  THEN 'económico'
    WHEN precio < 100 THEN 'moderado'
    ELSE 'premium'
  END AS rango_precio
FROM productos;
\`\`\``,
      },
      {
        id: "2-2",
        type: "concept",
        title: "Funciones esenciales de PostgreSQL",
        duration: "15 min",
        content: `**Funciones de texto:**
\`\`\`sql
UPPER(texto)          -- 'hola' → 'HOLA'
LOWER(texto)          -- 'HOLA' → 'hola'
TRIM(texto)           -- elimina espacios al inicio/fin
LENGTH(texto)         -- número de caracteres
SUBSTRING(texto, 1,5) -- extrae substring: posición, longitud
CONCAT(a, ' ', b)     -- concatenar (también: a || ' ' || b)
REPLACE(texto, 'de','')-- reemplazar
LEFT(texto, 3)        -- primeros 3 caracteres
RIGHT(texto, 3)       -- últimos 3 caracteres
SPLIT_PART('a,b,c',',',2) -- → 'b'
\`\`\`

**Funciones de fecha:**
\`\`\`sql
NOW()                          -- fecha y hora actual
CURRENT_DATE                   -- solo fecha de hoy
EXTRACT(YEAR FROM fecha)       -- extraer parte: YEAR, MONTH, DAY, HOUR...
DATE_PART('month', fecha)      -- equivalente a EXTRACT
DATE_TRUNC('month', fecha)     -- truncar al inicio del mes
AGE(fecha1, fecha2)            -- diferencia como intervalo
fecha + INTERVAL '30 days'     -- sumar tiempo
TO_CHAR(fecha, 'DD/MM/YYYY')   -- formatear como texto
TO_DATE('15/03/2024','DD/MM/YYYY') -- texto a fecha
\`\`\`

**Funciones numéricas:**
\`\`\`sql
ROUND(3.14159, 2)    -- → 3.14
CEIL(3.1)            -- → 4 (redondear arriba)
FLOOR(3.9)           -- → 3 (redondear abajo)
ABS(-42)             -- → 42 (valor absoluto)
MOD(10, 3)           -- → 1 (módulo / resto)
POWER(2, 10)         -- → 1024
\`\`\`

**Funciones de nulos:**
\`\`\`sql
COALESCE(col1, col2, 'valor_defecto')  -- retorna el primer no-NULL
NULLIF(a, b)                           -- retorna NULL si a = b
\`\`\``,
      },
      {
        id: "2-3",
        type: "exercise",
        title: "Ejercicio: Consultas sobre la librería",
        duration: "25 min",
        scenario: `Usando el esquema de la librería del módulo anterior, escribe queries para:

1. Listar todos los libros con precio entre $15 y $60, ordenados de más caro a más barato.
2. Encontrar los 5 clientes registrados más recientemente, mostrando nombre, email y hace cuántos días se registraron.
3. Mostrar cada libro con su precio original, precio con 8% de descuento (redondeado a 2 decimales), y una etiqueta: 'bajo' si queda < $20, 'medio' si queda entre $20-$50, 'alto' si supera $50.
4. Listar libros cuyo título contenga la palabra 'data' (sin importar mayúsculas) y que tengan descripción.`,
        hint: `Para el tiempo desde el registro: DATE_PART('day', NOW() - registrado) o simplemente (NOW()::DATE - registrado::DATE). Para el CASE con precio con descuento, necesitas repetir el cálculo o usar una subquery.`,
        solution: `-- 1. Libros entre $15 y $60
SELECT titulo, precio
FROM libros
WHERE precio BETWEEN 15 AND 60
ORDER BY precio DESC;

-- 2. 5 clientes más recientes con días desde registro
SELECT 
  nombre,
  email,
  registrado::DATE AS fecha_registro,
  (CURRENT_DATE - registrado::DATE) AS dias_registrado
FROM clientes
ORDER BY registrado DESC
LIMIT 5;

-- 3. Precios con descuento y etiqueta
SELECT
  titulo,
  precio AS precio_original,
  ROUND(precio * 0.92, 2) AS precio_con_descuento,
  CASE
    WHEN ROUND(precio * 0.92, 2) < 20   THEN 'bajo'
    WHEN ROUND(precio * 0.92, 2) <= 50  THEN 'medio'
    ELSE 'alto'
  END AS rango
FROM libros;

-- Alternativa más limpia con subquery:
SELECT titulo, precio_original, precio_con_descuento,
  CASE
    WHEN precio_con_descuento < 20  THEN 'bajo'
    WHEN precio_con_descuento <= 50 THEN 'medio'
    ELSE 'alto'
  END AS rango
FROM (
  SELECT titulo, precio AS precio_original,
         ROUND(precio * 0.92, 2) AS precio_con_descuento
  FROM libros
) sub;

-- 4. Libros con 'data' en título y con descripción
SELECT titulo, descripcion
FROM libros
WHERE titulo ILIKE '%data%'
  AND descripcion IS NOT NULL;`,
        keyPoints: [
          "ILIKE es case-insensitive, LIKE es sensible a mayúsculas",
          "El cast ::DATE convierte TIMESTAMPTZ a fecha, permitiendo la resta directa",
          "Una subquery en el FROM permite reusar columnas calculadas en el mismo nivel",
          "BETWEEN es inclusivo en ambos extremos",
        ],
      },
      {
        id: "2-4",
        type: "quiz",
        title: "Quiz: SELECT y filtros",
        questions: [
          {
            q: "¿Qué diferencia hay entre WHERE y HAVING?",
            opts: [
              "No hay diferencia, son sinónimos",
              "WHERE filtra filas antes de agrupar; HAVING filtra grupos después del GROUP BY",
              "HAVING es más rápido que WHERE",
              "WHERE solo funciona con strings, HAVING con números",
            ],
            correct: 1,
            explain: "WHERE se ejecuta antes de GROUP BY y filtra filas individuales. HAVING se ejecuta después y filtra grupos ya formados. Si puedes usar WHERE, úsalo — es más eficiente porque reduce las filas antes de agrupar.",
          },
          {
            q: "¿Qué retorna COALESCE(NULL, NULL, 'tercero', 'cuarto')?",
            opts: ["NULL", "'tercero'", "'cuarto'", "Un error"],
            correct: 1,
            explain: "COALESCE retorna el primer valor no-NULL. Como los primeros dos son NULL, retorna 'tercero'. Es extremadamente útil para dar valores por defecto cuando una columna puede ser NULL.",
          },
          {
            q: "¿Cuál es el resultado de: SELECT 'juan' LIKE 'J%'?",
            opts: ["TRUE", "FALSE", "NULL", "Error de sintaxis"],
            correct: 1,
            explain: "LIKE es case-sensitive. 'juan' no empieza con 'J' mayúscula, por eso es FALSE. Para búsqueda sin importar mayúsculas, usa ILIKE (PostgreSQL) o LOWER(col) LIKE LOWER(patron).",
          },
        ],
      },
    ],
    resources: [
      {
        type: "book",
        icon: "📖",
        title: "Learning SQL — Alan Beaulieu",
        detail: "Capítulos 4-7: cláusula WHERE, operadores, funciones de texto y fecha. Especialmente útil el capítulo sobre NULL.",
        url: "https://www.oreilly.com/library/view/learning-sql-3rd/9781492057604/",
      },
      {
        type: "practice",
        icon: "🎮",
        title: "SQLZoo — Ejercicios interactivos",
        detail: "Secciones 'SELECT basics', 'SELECT names' y 'SELECT from World'. Resuelves queries en el navegador con retroalimentación inmediata.",
        url: "https://sqlzoo.net/wiki/SQL_Tutorial",
      },
      {
        type: "practice",
        icon: "💻",
        title: "pgexercises.com",
        detail: "Ejercicios interactivos específicos de PostgreSQL. Empieza por la sección 'Basic' — 13 ejercicios con explicaciones detalladas.",
        url: "https://pgexercises.com/questions/basic/",
      },
    ],
  },

  {
    id: 3,
    emoji: "🔗",
    title: "JOINs: Conectando Tablas",
    subtitle: "El poder del modelo relacional en acción",
    color: "#065f46",
    colorLt: "#d1fae5",
    xp: 120,
    tag: "RELACIONES",
    lessons: [
      {
        id: "3-1",
        type: "concept",
        title: "INNER JOIN, LEFT JOIN y sus variantes",
        duration: "20 min",
        content: `Los JOINs combinan filas de dos o más tablas basándose en una condición.

**INNER JOIN** — solo filas que tienen coincidencia en ambas tablas:
\`\`\`sql
SELECT c.nombre, p.total, p.fecha
FROM clientes c
INNER JOIN pedidos p ON p.cliente_id = c.id;
-- Solo clientes que tienen al menos un pedido
\`\`\`

**LEFT JOIN** — todas las filas de la tabla izquierda, más las coincidencias de la derecha (NULL si no hay):
\`\`\`sql
SELECT c.nombre, p.total, p.fecha
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id;
-- Todos los clientes, incluso los que NO tienen pedidos
-- Sus columnas de pedidos serán NULL
\`\`\`

**RIGHT JOIN** — igual que LEFT pero al revés (poco común; conviene reescribir como LEFT):
\`\`\`sql
-- Estos dos queries son equivalentes:
SELECT * FROM a RIGHT JOIN b ON a.id = b.a_id;
SELECT * FROM b LEFT JOIN a ON a.id = b.a_id;
\`\`\`

**FULL OUTER JOIN** — todas las filas de ambas tablas:
\`\`\`sql
SELECT c.nombre, p.nombre AS proveedor
FROM clientes c
FULL OUTER JOIN proveedores p ON c.region = p.region;
\`\`\`

**Patrón muy útil: encontrar filas SIN coincidencia:**
\`\`\`sql
-- Clientes que NUNCA han hecho un pedido
SELECT c.id, c.nombre
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
WHERE p.id IS NULL;  -- Si p.id es NULL, no hay pedido
\`\`\`

**Múltiples JOINs:**
\`\`\`sql
SELECT 
  c.nombre AS cliente,
  p.fecha,
  pr.titulo AS producto,
  oi.cantidad,
  oi.precio_unit
FROM ordenes p
JOIN clientes c     ON c.id = p.cliente_id
JOIN orden_items oi ON oi.orden_id = p.id
JOIN libros pr      ON pr.id = oi.libro_id
ORDER BY p.fecha DESC;
\`\`\``,
      },
      {
        id: "3-2",
        type: "concept",
        title: "GROUP BY y funciones de agregación",
        duration: "18 min",
        content: `**GROUP BY** agrupa filas con el mismo valor en columnas especificadas, permitiendo aplicar funciones de agregación al grupo.

**Funciones de agregación:**
\`\`\`sql
COUNT(*)         -- cuenta todas las filas del grupo
COUNT(columna)   -- cuenta filas donde columna no es NULL
SUM(columna)     -- suma total
AVG(columna)     -- promedio
MIN(columna)     -- valor mínimo
MAX(columna)     -- valor máximo
\`\`\`

**Ejemplo paso a paso:**
\`\`\`sql
-- Total de ventas y número de órdenes por cliente
SELECT 
  c.nombre,
  COUNT(o.id)    AS total_ordenes,
  SUM(oi.precio_unit * oi.cantidad) AS ingresos_total,
  AVG(oi.precio_unit * oi.cantidad) AS ticket_promedio,
  MAX(o.fecha)   AS ultima_orden
FROM clientes c
JOIN ordenes o    ON o.cliente_id = c.id
JOIN orden_items oi ON oi.orden_id = o.id
GROUP BY c.id, c.nombre  -- debes incluir todas las columnas no-agregadas
HAVING SUM(oi.precio_unit * oi.cantidad) > 100  -- solo clientes con >$100
ORDER BY ingresos_total DESC;
\`\`\`

**Regla importante:** En un SELECT con GROUP BY, cada columna debe ser:
1. Parte del GROUP BY, O
2. Una función de agregación (SUM, COUNT, etc.)

\`\`\`sql
-- ❌ ERROR: nombre no está en GROUP BY ni es agregada
SELECT nombre, email, COUNT(*) FROM clientes GROUP BY nombre;

-- ✅ CORRECTO
SELECT nombre, email, COUNT(*) FROM clientes GROUP BY nombre, email;
\`\`\`

**COUNT(*) vs COUNT(columna):**
\`\`\`sql
-- COUNT(*) cuenta todas las filas, incluyendo las que tienen NULL
-- COUNT(columna) ignora los NULLs en esa columna
SELECT 
  COUNT(*) AS total_productos,
  COUNT(descripcion) AS productos_con_descripcion
FROM libros;
\`\`\``,
      },
      {
        id: "3-3",
        type: "exercise",
        title: "Ejercicio: Reportes con JOINs",
        duration: "30 min",
        scenario: `Con el esquema de la librería, escribe queries para:

1. Listar todos los libros con el nombre de sus autores (un libro con 2 autores debe aparecer 2 veces).
2. Mostrar los 3 libros más vendidos (por cantidad de ejemplares vendidos en total).
3. Listar los clientes que **no han realizado ninguna orden**.
4. Calcular el ingreso total por mes del año 2024, mostrando el mes en formato 'Enero 2024', y ordenado cronológicamente.`,
        hint: `Para el punto 4: usa DATE_TRUNC para agrupar por mes y TO_CHAR para formatearlo. Para el punto 3: LEFT JOIN con WHERE IS NULL es el patrón correcto.`,
        solution: `-- 1. Libros con sus autores
SELECT l.titulo, a.nombre AS autor
FROM libros l
JOIN libros_autores la ON la.libro_id = l.id
JOIN autores a ON a.id = la.autor_id
ORDER BY l.titulo, a.nombre;

-- 2. Top 3 libros más vendidos por cantidad
SELECT 
  l.titulo,
  SUM(oi.cantidad) AS ejemplares_vendidos
FROM libros l
JOIN orden_items oi ON oi.libro_id = l.id
GROUP BY l.id, l.titulo
ORDER BY ejemplares_vendidos DESC
LIMIT 3;

-- 3. Clientes sin órdenes (anti-join)
SELECT c.id, c.nombre, c.email
FROM clientes c
LEFT JOIN ordenes o ON o.cliente_id = c.id
WHERE o.id IS NULL;

-- 4. Ingresos por mes en 2024
SELECT 
  TO_CHAR(DATE_TRUNC('month', o.fecha), 'Month YYYY') AS mes,
  SUM(oi.precio_unit * oi.cantidad) AS ingresos
FROM ordenes o
JOIN orden_items oi ON oi.orden_id = o.id
WHERE o.fecha >= '2024-01-01' AND o.fecha < '2025-01-01'
GROUP BY DATE_TRUNC('month', o.fecha)
ORDER BY DATE_TRUNC('month', o.fecha);`,
        keyPoints: [
          "El patrón LEFT JOIN + WHERE IS NULL es el anti-join: encuentra filas sin correspondencia",
          "Siempre agrupar por el campo que usas para filtrar (DATE_TRUNC), no por el formateado (TO_CHAR)",
          "WHERE fecha >= '2024-01-01' AND fecha < '2025-01-01' es más seguro que BETWEEN con timestamps",
          "SUM(oi.precio_unit * oi.cantidad) calcula el subtotal línea a línea antes de sumar",
        ],
      },
      {
        id: "3-4",
        type: "quiz",
        title: "Quiz: JOINs y agregaciones",
        questions: [
          {
            q: "Tabla A tiene 4 filas, tabla B tiene 3 filas. ¿Cuántas filas puede retornar un CROSS JOIN entre A y B?",
            opts: ["4", "3", "7", "12"],
            correct: 3,
            explain: "CROSS JOIN produce el producto cartesiano: cada fila de A combinada con cada fila de B. 4 × 3 = 12 filas. Rara vez se usa intencionalmente, pero es bueno saber qué pasa cuando omites la condición ON en un JOIN.",
          },
          {
            q: "¿Por qué a veces COUNT(*) y COUNT(columna) dan resultados diferentes?",
            opts: [
              "Son siempre iguales",
              "COUNT(*) cuenta filas totales; COUNT(columna) ignora filas donde esa columna es NULL",
              "COUNT(columna) es más lento",
              "COUNT(*) solo funciona sin GROUP BY",
            ],
            correct: 1,
            explain: "COUNT(*) cuenta todas las filas del grupo sin excepción. COUNT(columna) solo cuenta las filas donde esa columna tiene un valor (no NULL). Útil para saber cuántos registros tienen un campo opcional rellenado.",
          },
          {
            q: "¿Puedes usar un alias de SELECT en la cláusula WHERE?",
            opts: [
              "Sí, siempre",
              "No, WHERE se ejecuta antes que SELECT. Debes repetir la expresión o usar una subquery",
              "Sí, pero solo en PostgreSQL",
              "Solo si el alias no contiene espacios",
            ],
            correct: 1,
            explain: "El orden de ejecución lógico en SQL es: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. WHERE se procesa antes que SELECT, por eso no 've' los alias definidos en SELECT. La excepción es ORDER BY, que sí puede usar alias.",
          },
        ],
      },
    ],
    resources: [
      {
        type: "video",
        icon: "🎬",
        title: "Visual Guide to SQL JOINs — Socratica",
        detail: "Explicación visual con diagramas de Venn de cada tipo de JOIN. Muy clara para afianzar la intuición visual antes de practicar.",
        url: "https://www.youtube.com/watch?v=9yeOJ0ZMUYw",
      },
      {
        type: "practice",
        icon: "🎮",
        title: "pgexercises.com — Sección Joins",
        detail: "13 ejercicios de JOIN con dificultad creciente y soluciones comentadas. El mejor recurso práctico para este tema.",
        url: "https://pgexercises.com/questions/joins/",
      },
      {
        type: "book",
        icon: "📖",
        title: "Learning SQL — Capítulo 5: Querying Multiple Tables",
        detail: "El capítulo más importante del libro. Cubre todos los tipos de JOIN con ejemplos reales y explica la sintaxis ANSI vs legacy.",
        url: "https://www.oreilly.com/library/view/learning-sql-3rd/9781492057604/",
      },
      {
        type: "project",
        icon: "🛠️",
        title: "Mini-proyecto: Dashboard de reportes",
        detail: "Con tu esquema de librería: crea un archivo .sql con 5 queries de reporte (ventas por mes, top clientes, libros más vendidos, ingresos por autor, órdenes sin completar). Ponlo en GitHub.",
        url: null,
      },
    ],
  },

  {
    id: 4,
    emoji: "🏗️",
    title: "DDL: Definiendo la Estructura",
    subtitle: "Crear, modificar y mantener esquemas",
    color: "#7c3aed",
    colorLt: "#ede9fe",
    xp: 90,
    tag: "ESTRUCTURA",
    lessons: [
      {
        id: "4-1",
        type: "concept",
        title: "ALTER TABLE y migraciones básicas",
        duration: "15 min",
        content: `Una vez que tu base de datos está en producción, necesitas modificarla sin perder datos. Las migraciones son el proceso de evolucionar el esquema.

**ALTER TABLE — las operaciones más comunes:**
\`\`\`sql
-- Agregar columna
ALTER TABLE clientes ADD COLUMN telefono VARCHAR(20);
ALTER TABLE clientes ADD COLUMN activo BOOLEAN NOT NULL DEFAULT TRUE;

-- Eliminar columna (¡irreversible en producción!)
ALTER TABLE clientes DROP COLUMN telefono;

-- Cambiar tipo de dato
ALTER TABLE productos ALTER COLUMN precio TYPE NUMERIC(12,2);

-- Renombrar columna
ALTER TABLE clientes RENAME COLUMN nombre TO nombre_completo;

-- Agregar constraint
ALTER TABLE pedidos ADD CONSTRAINT chk_total_positivo 
  CHECK (total > 0);

-- Eliminar constraint
ALTER TABLE pedidos DROP CONSTRAINT chk_total_positivo;

-- Agregar FK
ALTER TABLE pedidos 
  ADD CONSTRAINT fk_cliente 
  FOREIGN KEY (cliente_id) REFERENCES clientes(id);
\`\`\`

**Buenas prácticas de migraciones:**
\`\`\`sql
-- Siempre usa transacciones para migraciones
BEGIN;

ALTER TABLE clientes ADD COLUMN plan VARCHAR(20) DEFAULT 'free';
UPDATE clientes SET plan = 'premium' WHERE created_before < '2020-01-01';
ALTER TABLE clientes ALTER COLUMN plan SET NOT NULL;

-- Verifica antes de confirmar
SELECT plan, COUNT(*) FROM clientes GROUP BY plan;

COMMIT;
-- o ROLLBACK si algo salió mal
\`\`\`

**Crear índices sin bloquear (importante en producción):**
\`\`\`sql
-- Bloquea la tabla durante la construcción (evitar en producción activa)
CREATE INDEX ON clientes(email);

-- No bloquea lecturas ni escrituras (más lento pero seguro)
CREATE INDEX CONCURRENTLY ON clientes(email);
\`\`\``,
      },
      {
        id: "4-2",
        type: "concept",
        title: "Índices: cuándo y cómo crearlos",
        duration: "15 min",
        content: `Un índice es una estructura de datos adicional que permite encontrar filas rápidamente sin escanear toda la tabla. Como el índice de un libro.

**Sin índice:** PostgreSQL lee todas las filas (Seq Scan).
**Con índice:** PostgreSQL va directo a las filas relevantes (Index Scan).

**¿Cuándo crear un índice?**
\`\`\`sql
-- ✅ Buenas candidatas para índices:
-- 1. Columnas usadas frecuentemente en WHERE
CREATE INDEX ON pedidos(fecha);
CREATE INDEX ON clientes(email);  -- aunque UNIQUE ya crea un índice

-- 2. Columnas usadas en JOINs (FKs casi siempre deben tener índice)
CREATE INDEX ON pedidos(cliente_id);
CREATE INDEX ON orden_items(orden_id);
CREATE INDEX ON orden_items(libro_id);

-- 3. Columnas usadas en ORDER BY con LIMIT
CREATE INDEX ON articulos(publicado_en DESC);
\`\`\`

**Índice compuesto — para queries que filtran por múltiples columnas:**
\`\`\`sql
-- Query frecuente: pedidos de un cliente en un período
SELECT * FROM pedidos 
WHERE cliente_id = 42 AND fecha >= '2024-01-01';

-- Índice compuesto (orden importa: primero igualdad, luego rango)
CREATE INDEX ON pedidos(cliente_id, fecha);
\`\`\`

**Ver los índices de una tabla:**
\`\`\`sql
\d nombre_tabla    -- en psql, muestra índices y constraints
-- o
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'pedidos';
\`\`\`

**¿Cuándo NO crear índices?**
- Tablas muy pequeñas (< 1000 filas): el seq scan es más rápido.
- Columnas con muy baja cardinalidad (ej: campo booleano: solo 2 valores).
- Tablas con muchos INSERTs/UPDATEs: cada índice ralentiza las escrituras.
`,
      },
      {
        id: "4-3",
        type: "exercise",
        title: "Ejercicio: Evolucionar el esquema",
        duration: "20 min",
        scenario: `Tu librería en línea va a crecer. Necesitas hacer estas modificaciones al esquema:

1. Agregar un sistema de reseñas: los clientes pueden dejar una puntuación (1-5) y comentario en cada libro que compraron. Una persona solo puede reseñar un libro una vez.
2. Agregar campo \`descuento_pct\` a \`orden_items\` (puede ser NULL si no hay descuento).
3. Los libros ahora tienen stock. Agregar columna \`stock_disponible\` con valor por defecto 0, que no puede ser negativo.
4. Crear los índices más importantes para la tabla de reseñas.

Escribe todos los cambios como migraciones en una transacción.`,
        hint: `Para la restricción de unicidad en reseñas (un cliente, un libro), piensa en PRIMARY KEY compuesta o UNIQUE. Para CHECK con stock, es un constraint en ALTER TABLE.`,
        solution: `BEGIN;

-- 1. Tabla de reseñas
CREATE TABLE resenas (
  id          BIGSERIAL PRIMARY KEY,
  libro_id    BIGINT NOT NULL REFERENCES libros(id) ON DELETE CASCADE,
  cliente_id  BIGINT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  puntuacion  SMALLINT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
  comentario  TEXT,
  creada_en   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (libro_id, cliente_id)  -- un cliente, una reseña por libro
);

-- 2. Descuento en líneas de orden
ALTER TABLE orden_items 
  ADD COLUMN descuento_pct NUMERIC(5,2) 
    CHECK (descuento_pct IS NULL OR descuento_pct BETWEEN 0 AND 100);

-- 3. Stock en libros
ALTER TABLE libros 
  ADD COLUMN stock_disponible INTEGER NOT NULL DEFAULT 0
    CHECK (stock_disponible >= 0);

-- 4. Índices para reseñas
CREATE INDEX ON resenas(libro_id);           -- buscar reseñas de un libro
CREATE INDEX ON resenas(cliente_id);         -- historial de reseñas del cliente
CREATE INDEX ON resenas(puntuacion);         -- filtrar por puntuación
CREATE INDEX ON resenas(creada_en DESC);     -- reseñas recientes primero

-- Verificar
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name IN ('resenas', 'libros', 'orden_items')
ORDER BY table_name, ordinal_position;

COMMIT;`,
        keyPoints: [
          "UNIQUE en múltiples columnas previene duplicados combinados (un par único)",
          "CHECK con IS NULL OR condicion permite NULLs pero valida los no-NULL",
          "Siempre envolver migraciones en BEGIN/COMMIT permite hacer ROLLBACK si algo falla",
          "information_schema.columns es la forma estándar de inspeccionar el esquema",
        ],
      },
    ],
    resources: [
      {
        type: "video",
        icon: "🎬",
        title: "Database Indexing Explained — Hussein Nasser",
        detail: "Explicación visual de cómo funcionan los índices B-tree internamente. ~25 minutos, fundamental para entender cuándo ayudan y cuándo no.",
        url: "https://www.youtube.com/watch?v=-qNSXK7s7_w",
      },
      {
        type: "practice",
        icon: "💻",
        title: "Use The Index, Luke — Markus Winand",
        detail: "Libro/sitio gratuito dedicado 100% a índices. Empieza por 'Anatomy of an Index'. Cambia cómo piensas en queries para siempre.",
        url: "https://use-the-index-luke.com/",
      },
      {
        type: "project",
        icon: "🛠️",
        title: "Mini-proyecto: Script de migración versionada",
        detail: "Crea 3 archivos: V1__schema_inicial.sql, V2__agregar_resenas.sql, V3__agregar_stock.sql. Aprende la convención que usa Flyway/Liquibase para versionar migraciones.",
        url: null,
      },
    ],
  },

  {
    id: 5,
    emoji: "✏️",
    title: "DML: Manipulando Datos",
    subtitle: "INSERT, UPDATE, DELETE con seguridad",
    color: "#b45309",
    colorLt: "#fef3c7",
    xp: 100,
    tag: "ESCRITURA",
    lessons: [
      {
        id: "5-1",
        type: "concept",
        title: "INSERT, UPDATE y DELETE avanzados",
        duration: "18 min",
        content: `**INSERT — todas las variantes:**
\`\`\`sql
-- Insert básico
INSERT INTO clientes (nombre, email) VALUES ('Ana García', 'ana@email.com');

-- Insert múltiple (un solo statement, más eficiente)
INSERT INTO libros (titulo, isbn, precio) VALUES
  ('Clean Code', '978-0132350884', 35.99),
  ('The Pragmatic Programmer', '978-0135957059', 42.50),
  ('Designing Data-Intensive Applications', '978-1449373320', 55.00);

-- Insert desde SELECT (copiar/transformar datos)
INSERT INTO clientes_vip (cliente_id, nivel)
SELECT id, 'oro'
FROM clientes
WHERE registrado < '2020-01-01';

-- INSERT ... RETURNING (retorna las filas insertadas)
INSERT INTO ordenes (cliente_id, estado)
VALUES (42, 'pendiente')
RETURNING id, fecha;  -- muy útil para obtener el ID generado
\`\`\`

**UPDATE con subqueries:**
\`\`\`sql
-- Update básico
UPDATE libros SET precio = precio * 1.10 WHERE ano_pub < 2010;

-- Update con FROM (actualizar usando otra tabla — patrón importante)
UPDATE orden_items oi
SET precio_unit = l.precio
FROM libros l
WHERE oi.libro_id = l.id
  AND oi.precio_unit != l.precio;  -- solo los que difieren

-- UPDATE ... RETURNING
UPDATE clientes 
SET plan = 'premium'
WHERE id = 42
RETURNING id, nombre, plan;
\`\`\`

**DELETE seguro:**
\`\`\`sql
-- SIEMPRE verifica antes de borrar
SELECT * FROM ordenes WHERE estado = 'cancelada' AND fecha < '2020-01-01';

-- Luego ejecutas el DELETE con la misma condición
DELETE FROM ordenes WHERE estado = 'cancelada' AND fecha < '2020-01-01';

-- DELETE con RETURNING
DELETE FROM sesiones WHERE expira_en < NOW()
RETURNING usuario_id, expira_en;

-- TRUNCATE: borra TODAS las filas muy rápido (no se puede con WHERE)
TRUNCATE TABLE sesiones;  -- ¡cuidado, no hay RETURNING ni filtro!
\`\`\`

**UPSERT con ON CONFLICT:**
\`\`\`sql
-- Si el email ya existe, actualizar en vez de error
INSERT INTO clientes (email, nombre)
VALUES ('ana@email.com', 'Ana García')
ON CONFLICT (email) 
DO UPDATE SET nombre = EXCLUDED.nombre;
-- EXCLUDED referencia a los valores que intentabas insertar

-- Si ya existe, no hacer nada
INSERT INTO suscripciones (usuario_id, newsletter)
VALUES (42, 'tech')
ON CONFLICT (usuario_id, newsletter) DO NOTHING;
\`\`\``,
      },
      {
        id: "5-2",
        type: "concept",
        title: "Transacciones: la garantía ACID",
        duration: "15 min",
        content: `Una transacción es un grupo de operaciones que se ejecutan como una unidad indivisible.

**ACID:**
- **A**tomicity: todo o nada. Si algo falla, nada se aplica.
- **C**onsistency: la base de datos pasa de un estado válido a otro válido.
- **I**solation: las transacciones concurrentes no se interfieren.
- **D**urability: los datos committed sobreviven incluso a un crash.

**Sintaxis básica:**
\`\`\`sql
BEGIN;  -- o START TRANSACTION

  -- Transferencia bancaria: ejemplo clásico
  UPDATE cuentas SET saldo = saldo - 1000 WHERE id = 1;
  UPDATE cuentas SET saldo = saldo + 1000 WHERE id = 2;
  
  -- Verificar que todo esté bien
  SELECT id, saldo FROM cuentas WHERE id IN (1, 2);

COMMIT;   -- confirmar todos los cambios

-- Si algo salió mal en cualquier punto:
ROLLBACK; -- revertir TODO lo que hiciste desde BEGIN
\`\`\`

**SAVEPOINT — rollback parcial:**
\`\`\`sql
BEGIN;
  INSERT INTO pedidos (cliente_id, total) VALUES (1, 100) RETURNING id;
  SAVEPOINT despues_pedido;
  
  INSERT INTO pagos (pedido_id, monto) VALUES (99999, 100); -- error: id inválido
  
  ROLLBACK TO SAVEPOINT despues_pedido;  -- solo deshace el insert de pagos
  
  -- El pedido sigue insertado, podemos intentar de nuevo
  INSERT INTO pagos (pedido_id, monto) VALUES (1, 100);
COMMIT;
\`\`\`

**Reglas prácticas:**
- En aplicaciones, usar transacciones para operaciones que modifican múltiples tablas relacionadas.
- Mantener las transacciones cortas para no bloquear recursos.
- PostgreSQL envuelve cada statement individual en una transacción automática (autocommit).`,
      },
      {
        id: "5-3",
        type: "exercise",
        title: "Ejercicio: Proceso de compra completo",
        duration: "25 min",
        scenario: `Escribe una transacción que simule el proceso completo de realizar una compra en la librería:

1. Crear una orden para el cliente con id=1
2. Agregar 2 ítems: el libro con id=1 (2 ejemplares) y el libro con id=3 (1 ejemplar) — los precios deben tomarse de la tabla libros en el momento de la compra
3. Verificar que cada libro tenga stock suficiente antes de agregar el ítem; si no hay stock, hacer ROLLBACK
4. Descontar el stock de cada libro comprado
5. Retornar el id de la orden creada y el total calculado

Usa un bloque de transacción con verificaciones.`,
        hint: `Puedes usar variables en psql o simplemente usar CTEs encadenados. Con un DO block o función podrías usar variables. Para el ejercicio, un enfoque con CTEs o statements separados dentro de BEGIN/COMMIT es válido.`,
        solution: `BEGIN;

-- Verificar stock antes de proceder
-- Si alguno falla la verificación, hacemos ROLLBACK manualmente

-- Verificar stock libro 1 (necesitamos 2)
DO $$
BEGIN
  IF (SELECT stock_disponible FROM libros WHERE id = 1) < 2 THEN
    RAISE EXCEPTION 'Stock insuficiente para libro id=1';
  END IF;
  IF (SELECT stock_disponible FROM libros WHERE id = 3) < 1 THEN
    RAISE EXCEPTION 'Stock insuficiente para libro id=3';
  END IF;
END;
$$;

-- Crear la orden
INSERT INTO ordenes (cliente_id, estado)
VALUES (1, 'pendiente');

-- Agregar ítems (precio tomado de la tabla libros en este momento)
INSERT INTO orden_items (orden_id, libro_id, cantidad, precio_unit)
SELECT 
  currval('ordenes_id_seq'),  -- ID de la orden recién creada
  l.id,
  items.cantidad,
  l.precio
FROM libros l
JOIN (VALUES (1, 2), (3, 1)) AS items(libro_id, cantidad)
  ON l.id = items.libro_id;

-- Descontar stock
UPDATE libros SET stock_disponible = stock_disponible - 2 WHERE id = 1;
UPDATE libros SET stock_disponible = stock_disponible - 1 WHERE id = 3;

-- Verificar el resultado
SELECT 
  o.id AS orden_id,
  SUM(oi.precio_unit * oi.cantidad) AS total
FROM ordenes o
JOIN orden_items oi ON oi.orden_id = o.id
WHERE o.id = currval('ordenes_id_seq')
GROUP BY o.id;

COMMIT;`,
        keyPoints: [
          "currval('secuencia') obtiene el último ID generado en la sesión actual",
          "DO $$ ... $$ permite ejecutar bloques PL/pgSQL anónimos con RAISE EXCEPTION",
          "RAISE EXCEPTION dentro de un DO block dentro de un BEGIN causa ROLLBACK automático si no se atrapa",
          "JOIN con VALUES(...) es una forma elegante de hacer múltiples inserts/updates en un solo statement",
        ],
      },
      {
        id: "5-4",
        type: "quiz",
        title: "Quiz: DML y transacciones",
        questions: [
          {
            q: "¿Qué hace ON CONFLICT DO NOTHING en un INSERT?",
            opts: [
              "Borra la fila existente e inserta la nueva",
              "Si la inserción violaría un constraint UNIQUE o PK, simplemente ignora el INSERT sin error",
              "Actualiza la fila existente con los nuevos valores",
              "Lanza una advertencia pero inserta de todas formas",
            ],
            correct: 1,
            explain: "DO NOTHING simplemente descarta el intento de insert si generaría un conflicto. Útil para inserts idempotentes donde no te importa si ya existía. DO UPDATE permite especificar qué actualizar.",
          },
          {
            q: "Ejecutaste BEGIN y luego 3 UPDATEs. El tercero falla con error. ¿Qué pasa con los primeros dos?",
            opts: [
              "Se confirmaron automáticamente al ejecutarse",
              "La transacción queda en estado 'aborted' — debes hacer ROLLBACK para limpiar. Ningún cambio se aplica",
              "Solo el tercero falla, los primeros dos se guardan",
              "Depende del tipo de error",
            ],
            correct: 1,
            explain: "Cuando un statement falla dentro de una transacción, PostgreSQL pone la transacción en estado 'aborted'. No puedes continuar ejecutando statements — solo ROLLBACK. Esto garantiza la atomicidad: o todo o nada.",
          },
          {
            q: "¿Cuál es la diferencia entre DELETE y TRUNCATE?",
            opts: [
              "Son equivalentes",
              "DELETE puede tener WHERE y activa triggers; TRUNCATE borra todo sin WHERE, no activa triggers row-level y es mucho más rápido",
              "TRUNCATE es más lento pero más seguro",
              "DELETE solo funciona con tablas pequeñas",
            ],
            correct: 1,
            explain: "DELETE es una operación fila por fila que puede filtrarse con WHERE, activa triggers y puede revertirse con ROLLBACK. TRUNCATE libera páginas enteras de datos, es ultra-rápido para borrar todo, pero no acepta WHERE y no activa triggers ROW-level.",
          },
        ],
      },
    ],
    resources: [
      {
        type: "video",
        icon: "🎬",
        title: "ACID Transactions — Fireship",
        detail: "Explicación en 100 segundos + video extendido de transacciones. Perfecto para solidificar el concepto de ACID de forma visual.",
        url: "https://www.youtube.com/watch?v=pomxJOFVcQs",
      },
      {
        type: "practice",
        icon: "🎮",
        title: "pgexercises.com — Sección Modifying Data",
        detail: "9 ejercicios de INSERT, UPDATE y DELETE con escenarios realistas. Incluye ejercicios de UPSERT que son muy comunes en entrevistas.",
        url: "https://pgexercises.com/questions/updates/",
      },
      {
        type: "project",
        icon: "🛠️",
        title: "Mini-proyecto: Seeder de datos de prueba",
        detail: "Escribe un script SQL que inserte datos de prueba realistas en tu librería: 10 autores, 30 libros, 20 clientes, 50 órdenes con items. Úsalo como base para practicar todas las queries del programa.",
        url: null,
      },
    ],
  },

  {
    id: 6,
    emoji: "📊",
    title: "Subqueries y CTEs",
    subtitle: "Queries dentro de queries — organiza la complejidad",
    color: "#0f766e",
    colorLt: "#ccfbf1",
    xp: 130,
    tag: "INTERMEDIO",
    lessons: [
      {
        id: "6-1",
        type: "concept",
        title: "Subqueries: escalares, de fila y de tabla",
        duration: "18 min",
        content: `Una subquery es un SELECT dentro de otro SELECT. Existen tres tipos:

**1. Subquery escalar** — retorna un solo valor, usable en SELECT o WHERE:
\`\`\`sql
-- En SELECT: calcular el precio promedio para comparar
SELECT 
  titulo,
  precio,
  precio - (SELECT AVG(precio) FROM libros) AS diferencia_promedio
FROM libros;

-- En WHERE: filtrar por un valor calculado
SELECT * FROM libros
WHERE precio > (SELECT AVG(precio) FROM libros);
\`\`\`

**2. Subquery de lista** — retorna una columna, usable con IN/NOT IN/ANY/ALL:
\`\`\`sql
-- Clientes que han comprado algún libro de programación
SELECT nombre FROM clientes
WHERE id IN (
  SELECT DISTINCT o.cliente_id
  FROM ordenes o
  JOIN orden_items oi ON oi.orden_id = o.id
  JOIN libros l ON l.id = oi.libro_id
  WHERE l.categoria = 'programacion'
);
\`\`\`

**3. Subquery correlacionada** — referencia a la query externa:
\`\`\`sql
-- Para cada libro, cuántas veces ha sido comprado
SELECT 
  l.titulo,
  (SELECT COALESCE(SUM(oi.cantidad), 0)
   FROM orden_items oi WHERE oi.libro_id = l.id) AS total_vendido
FROM libros l;
-- Se ejecuta una vez POR CADA LIBRO — puede ser lento en tablas grandes
\`\`\`

**EXISTS y NOT EXISTS** — más eficientes que IN para chequear existencia:
\`\`\`sql
-- Libros que tienen al menos una reseña con puntuación 5
SELECT titulo FROM libros l
WHERE EXISTS (
  SELECT 1 FROM resenas r 
  WHERE r.libro_id = l.id AND r.puntuacion = 5
);
-- EXISTS para tan pronto encuentra una fila, no necesita leerlas todas
\`\`\``,
      },
      {
        id: "6-2",
        type: "concept",
        title: "CTEs — WITH: organiza queries complejos",
        duration: "20 min",
        content: `Los CTEs (Common Table Expressions) nombran subqueries para reutilizarlas y hacer el código legible.

**Sintaxis:**
\`\`\`sql
WITH nombre_cte AS (
  SELECT ...
),
otro_cte AS (
  SELECT ... FROM nombre_cte ...  -- puede referenciar CTEs anteriores
)
SELECT * FROM otro_cte;
\`\`\`

**Ejemplo real: reporte de clientes con métricas:**
\`\`\`sql
WITH ventas_por_cliente AS (
  SELECT 
    o.cliente_id,
    COUNT(DISTINCT o.id)       AS total_ordenes,
    SUM(oi.precio_unit * oi.cantidad) AS gasto_total,
    MAX(o.fecha)               AS ultima_compra
  FROM ordenes o
  JOIN orden_items oi ON oi.orden_id = o.id
  GROUP BY o.cliente_id
),
clientes_activos AS (
  SELECT cliente_id
  FROM ventas_por_cliente
  WHERE ultima_compra >= NOW() - INTERVAL '6 months'
)
SELECT 
  c.nombre,
  c.email,
  vpc.total_ordenes,
  ROUND(vpc.gasto_total, 2) AS gasto_total,
  CASE 
    WHEN ca.cliente_id IS NOT NULL THEN 'activo'
    ELSE 'inactivo'
  END AS estado
FROM clientes c
LEFT JOIN ventas_por_cliente vpc ON vpc.cliente_id = c.id
LEFT JOIN clientes_activos ca ON ca.cliente_id = c.id
ORDER BY vpc.gasto_total DESC NULLS LAST;
\`\`\`

**CTE vs Subquery: cuándo usar cada uno:**
\`\`\`sql
-- Usa CTE cuando:
-- 1. La subquery se usa más de una vez
-- 2. El query tiene más de 2-3 niveles de anidación
-- 3. Quieres nombrar los pasos para claridad

-- Usa subquery cuando:
-- 1. Es simple y solo se usa una vez
-- 2. El contexto hace obvia la intención
\`\`\``,
      },
      {
        id: "6-3",
        type: "challenge",
        title: "🏆 Proyecto final del módulo: Reporte ejecutivo",
        duration: "45 min",
        scenario: `Usando todos los conocimientos acumulados, construye un reporte completo de la librería con una sola query (usando CTEs).

El reporte debe mostrar, para cada mes del año, las siguientes métricas:
- Total de órdenes realizadas
- Número de clientes únicos que compraron
- Ingresos totales
- Libro más vendido del mes (por cantidad de unidades)
- Ingreso promedio por orden
- Comparación con el mes anterior: ¿los ingresos subieron o bajaron? (muestra el porcentaje de cambio)

Ordena por mes descendiente.`,
        hint: `Usa múltiples CTEs: uno para métricas base por mes, otro para libro más vendido por mes, y usa LAG() en una ventana o un self-join para la comparación con mes anterior.`,
        solution: `WITH metricas_mes AS (
  -- Métricas base por mes
  SELECT
    DATE_TRUNC('month', o.fecha) AS mes,
    COUNT(DISTINCT o.id)          AS total_ordenes,
    COUNT(DISTINCT o.cliente_id)  AS clientes_unicos,
    SUM(oi.precio_unit * oi.cantidad) AS ingresos,
    AVG(oi.precio_unit * oi.cantidad) AS ticket_promedio
  FROM ordenes o
  JOIN orden_items oi ON oi.orden_id = o.id
  GROUP BY DATE_TRUNC('month', o.fecha)
),
ventas_libro_mes AS (
  -- Ventas por libro y mes
  SELECT
    DATE_TRUNC('month', o.fecha) AS mes,
    l.titulo,
    SUM(oi.cantidad) AS unidades
  FROM ordenes o
  JOIN orden_items oi ON oi.orden_id = o.id
  JOIN libros l ON l.id = oi.libro_id
  GROUP BY DATE_TRUNC('month', o.fecha), l.id, l.titulo
),
libro_top_mes AS (
  -- Solo el más vendido por mes
  SELECT DISTINCT ON (mes)
    mes, titulo, unidades
  FROM ventas_libro_mes
  ORDER BY mes, unidades DESC
),
metricas_con_lag AS (
  -- Agregar comparación con mes anterior
  SELECT
    mes,
    total_ordenes,
    clientes_unicos,
    ingresos,
    ROUND(ticket_promedio, 2) AS ticket_promedio,
    LAG(ingresos) OVER (ORDER BY mes) AS ingresos_mes_anterior
  FROM metricas_mes
)
SELECT
  TO_CHAR(m.mes, 'Month YYYY') AS mes,
  m.total_ordenes,
  m.clientes_unicos,
  ROUND(m.ingresos, 2) AS ingresos,
  m.ticket_promedio,
  lt.titulo AS libro_top,
  lt.unidades AS unidades_libro_top,
  CASE
    WHEN m.ingresos_mes_anterior IS NULL THEN 'primer mes'
    WHEN m.ingresos_mes_anterior = 0 THEN 'N/A'
    ELSE CONCAT(
      ROUND(((m.ingresos - m.ingresos_mes_anterior) / m.ingresos_mes_anterior * 100), 1),
      '%'
    )
  END AS cambio_vs_mes_anterior
FROM metricas_con_lag m
JOIN libro_top_mes lt ON lt.mes = m.mes
ORDER BY m.mes DESC;`,
        keyPoints: [
          "DISTINCT ON (mes) ORDER BY mes, unidades DESC — elegante para top-1 por grupo en PostgreSQL",
          "LAG(ingresos) OVER (ORDER BY mes) trae el valor del mes anterior sin self-join",
          "CTEs encadenados: cada uno puede referenciar a los anteriores",
          "DATE_TRUNC agrupa por mes; TO_CHAR solo formatea para mostrar (siempre ORDER BY el truncado, no el formateado)",
        ],
      },
    ],
    resources: [
      {
        type: "book",
        icon: "📖",
        title: "Learning SQL — Capítulo 9: Subqueries",
        detail: "El capítulo más completo sobre subqueries correlacionadas, EXISTS y las diferencias de rendimiento. Fundamental para el siguiente nivel.",
        url: "https://www.oreilly.com/library/view/learning-sql-3rd/9781492057604/",
      },
      {
        type: "practice",
        icon: "🎮",
        title: "pgexercises.com — Aggregates + Recursive",
        detail: "Las secciones 'Aggregates' (15 ejercicios) y 'Recursive' introducen CTEs y funciones de ventana con dificultad progresiva.",
        url: "https://pgexercises.com/questions/aggregates/",
      },
      {
        type: "video",
        icon: "🎬",
        title: "Advanced SQL Tutorial — Analyst Builder",
        detail: "Curso de 3 horas en YouTube que cubre CTEs, Window Functions y subqueries complejas con ejemplos de entrevistas técnicas reales.",
        url: "https://www.youtube.com/watch?v=BHwzDmr6d7s",
      },
      {
        type: "project",
        icon: "🛠️",
        title: "Proyecto integrador: Dashboard analítico completo",
        detail: "Crea un archivo 'reportes.sql' con 8 queries de reportes reales para tu librería: ventas mensuales, retención de clientes, libros más rentables, autores con más ventas, análisis de categorías. Conecta con una herramienta como Metabase o DBeaver para visualizarlo.",
        url: null,
      },
    ],
  },
];

/* ─── PROGRESS STORAGE (localStorage for persistence) ─── */
const STORAGE_KEY = "pg_junior_progress_v1";

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { completedLessons: {}, quizAnswers: {}, quizSubmitted: {} };
  } catch { return { completedLessons: {}, quizAnswers: {}, quizSubmitted: {} }; }
}
function saveProgress(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

/* ─── RENDER HELPERS ─── */
const CodeBlock = ({ code }) => (
  <pre style={{
    background: T.code, color: T.codeFg, fontFamily: "'JetBrains Mono','Fira Code',monospace",
    fontSize: 12.5, lineHeight: 1.7, padding: "14px 16px", borderRadius: 6,
    overflowX: "auto", margin: "10px 0", whiteSpace: "pre-wrap", wordBreak: "break-word",
    border: `1px solid #2d2a22`,
  }}>{code}</pre>
);

function renderContent(text) {
  if (!text) return null;
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith("```")) {
      return <CodeBlock key={i} code={part.replace(/```(?:\w+)?\n?/, "").replace(/```$/, "")} />;
    }
    return part.split("\n").map((line, j) => {
      if (!line.trim()) return <div key={j} style={{ height: 6 }} />;
      if (line.startsWith("**") && line.endsWith("**"))
        return <p key={j} style={{ color: T.ink, fontWeight: 700, fontSize: 15, marginTop: 14, marginBottom: 4, fontFamily: "'Crimson Pro', Georgia, serif" }}>{line.replace(/\*\*/g, "")}</p>;
      if (line.startsWith("- "))
        return <div key={j} style={{ display: "flex", gap: 10, marginBottom: 5 }}>
          <span style={{ color: T.amber, flexShrink: 0, marginTop: 2 }}>◆</span>
          <span style={{ fontSize: 14, color: T.inkMid, lineHeight: 1.6 }}
            dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong style="color:'+T.ink+'">$1</strong>').replace(/`(.*?)`/g, '<code style="background:#ede9e0;padding:1px 5px;border-radius:3px;font-family:monospace;font-size:12px">$1</code>') }} />
        </div>;
      return <p key={j} style={{ fontSize: 14, color: T.inkMid, lineHeight: 1.7, margin: "3px 0" }}
        dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong style="color:'+T.ink+'">$1</strong>').replace(/`(.*?)`/g, '<code style="background:#ede9e0;padding:1px 5px;border-radius:3px;font-family:monospace;font-size:12px">$1</code>') }} />;
    });
  });
}

/* ─── MAIN APP ─── */
export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [view, setView] = useState("home"); // home | module | lesson
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [showSolution, setShowSolution] = useState({});
  const [showHint, setShowHint] = useState({});
  const [tab, setTab] = useState("learn"); // learn | resources

  const updateProgress = (updates) => {
    setProgress(prev => {
      const next = { ...prev, ...updates };
      saveProgress(next);
      return next;
    });
  };

  const totalXp = MODULES.reduce((s, m) => s + m.xp, 0);
  const totalLessons = MODULES.reduce((s, m) => s + m.lessons.length, 0);
  const completedCount = Object.keys(progress.completedLessons).length;
  const earnedXp = Object.entries(progress.completedLessons).reduce((sum, [lid]) => {
    for (const m of MODULES) {
      const l = m.lessons.find(l => l.id === lid);
      if (l) return sum + Math.floor(m.xp / m.lessons.length);
    }
    return sum;
  }, 0);

  const levelInfo = earnedXp < 150 ? { label: "Iniciando", color: T.inkFaint, next: 150 }
    : earnedXp < 350 ? { label: "Junior", color: T.amber, next: 350 }
    : earnedXp < 600 ? { label: "Junior+", color: T.terra, next: 600 }
    : { label: "Intermedio 🎉", color: T.green, next: totalXp };

  const activeModule = MODULES.find(m => m.id === activeModuleId);
  const activeLesson = activeModule?.lessons.find(l => l.id === activeLessonId);

  const completeLesson = (lessonId) => {
    if (!progress.completedLessons[lessonId]) {
      updateProgress({ completedLessons: { ...progress.completedLessons, [lessonId]: true } });
    }
  };

  /* ── HOME ── */
  if (view === "home") {
    const pct = Math.round((earnedXp / totalXp) * 100);
    return (
      <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400;1,600&family=JetBrains+Mono:wght@400;500&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: ${T.bg}; }
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: ${T.bgDeep}; }
          ::-webkit-scrollbar-thumb { background: ${T.borderDk}; border-radius: 3px; }
        `}</style>

        {/* Hero */}
        <div style={{ background: T.ink, padding: "48px 40px 40px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 70% 50%, #3d2a0a 0%, transparent 60%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "inline-block", background: T.amber, color: T.ink, fontSize: 10, fontWeight: 700, letterSpacing: 3, padding: "4px 12px", borderRadius: 2, marginBottom: 16, textTransform: "uppercase" }}>
              PostgreSQL · Junior → Intermedio
            </div>
            <h1 style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontSize: 46, color: "#fff", fontWeight: 700, lineHeight: 1.1, marginBottom: 12 }}>
              Domina <em style={{ color: T.amber, fontStyle: "italic" }}>SQL</em> paso<br />a paso
            </h1>
            <p style={{ color: "#c9bfb0", fontSize: 16, maxWidth: 520, lineHeight: 1.6 }}>
              Desde entender tablas y tipos de datos hasta escribir subqueries complejos y optimizar con índices.
              Un camino estructurado para desarrolladores que quieren pasar de junior a intermedio.
            </p>
            <div style={{ marginTop: 28, display: "flex", gap: 32, flexWrap: "wrap" }}>
              {[
                { v: `${completedCount}/${totalLessons}`, l: "Lecciones" },
                { v: `${earnedXp}/${totalXp}`, l: "XP" },
                { v: levelInfo.label, l: "Nivel actual" },
                { v: `${pct}%`, l: "Completado" },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: i === 2 ? levelInfo.color : T.amber, fontFamily: "'Crimson Pro', serif" }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: "#a0917e", letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* XP bar */}
        <div style={{ height: 4, background: T.bgDeep }}>
          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${T.amber}, ${T.terra})`, transition: "width 0.6s ease" }} />
        </div>

        {/* Module cards */}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px 60px" }}>
          <h2 style={{ fontFamily: "'Crimson Pro', serif", fontSize: 28, color: T.ink, marginBottom: 8 }}>Módulos del programa</h2>
          <p style={{ color: T.inkFaint, fontSize: 14, marginBottom: 32 }}>Cada módulo incluye conceptos, ejercicios prácticos, quiz de verificación y recursos recomendados.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {MODULES.map((mod, idx) => {
              const done = mod.lessons.filter(l => progress.completedLessons[l.id]).length;
              const pctMod = Math.round((done / mod.lessons.length) * 100);
              const isComplete = pctMod === 100;
              return (
                <div key={mod.id} onClick={() => { setActiveModuleId(mod.id); setTab("learn"); setView("module"); }}
                  style={{ background: T.panel, border: `1.5px solid ${isComplete ? mod.color : T.border}`, borderRadius: 12, padding: 24, cursor: "pointer", transition: "all 0.2s", position: "relative" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${mod.color}25`; e.currentTarget.style.borderColor = mod.color; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = isComplete ? mod.color : T.border; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ fontSize: 36 }}>{mod.emoji}</div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: mod.color, background: mod.colorLt, padding: "2px 8px", borderRadius: 2 }}>{mod.tag}</span>
                      <span style={{ fontSize: 11, color: T.inkFaint }}>+{mod.xp} XP</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 9, color: T.inkFaint, letterSpacing: 1, marginBottom: 4 }}>MÓDULO {String(idx + 1).padStart(2, "0")}</div>
                  <h3 style={{ fontFamily: "'Crimson Pro', serif", fontSize: 20, color: T.ink, fontWeight: 700, marginBottom: 6, lineHeight: 1.2 }}>{mod.title}</h3>
                  <p style={{ fontSize: 13, color: T.inkMid, marginBottom: 16, lineHeight: 1.5 }}>{mod.subtitle}</p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: T.inkFaint }}>{done}/{mod.lessons.length} lecciones · {mod.resources.length} recursos</span>
                    {isComplete && <span style={{ fontSize: 12, color: mod.color, fontWeight: 600 }}>✓ Completo</span>}
                  </div>
                  <div style={{ height: 4, background: T.bgDeep, borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${pctMod}%`, background: mod.color, borderRadius: 2, transition: "width 0.4s" }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Journey map */}
          <div style={{ marginTop: 48, background: T.panel, border: `1px solid ${T.border}`, borderRadius: 12, padding: 28 }}>
            <h3 style={{ fontFamily: "'Crimson Pro', serif", fontSize: 22, color: T.ink, marginBottom: 6 }}>Tu camino de aprendizaje</h3>
            <p style={{ fontSize: 13, color: T.inkFaint, marginBottom: 20 }}>Completa los módulos en orden para construir conocimiento sólido</p>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0 }}>
              {MODULES.map((mod, i) => {
                const done = mod.lessons.every(l => progress.completedLessons[l.id]);
                return [
                  <div key={mod.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: done ? mod.color : T.bgDeep, border: `2px solid ${done ? mod.color : T.borderDk}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                      {done ? "✓" : mod.emoji}
                    </div>
                    <span style={{ fontSize: 10, color: T.inkFaint, maxWidth: 70, textAlign: "center", lineHeight: 1.3 }}>{mod.title.split(":")[0]}</span>
                  </div>,
                  i < MODULES.length - 1 && <div key={`line-${i}`} style={{ flex: 1, minWidth: 20, height: 2, background: done ? mod.color : T.borderDk, margin: "0 4px", marginBottom: 26 }} />
                ];
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── MODULE VIEW ── */
  if (view === "module" && activeModule) {
    const { color, colorLt } = activeModule;
    return (
      <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Crimson+Pro:ital,wght@0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap'); * { box-sizing: border-box; }`}</style>

        {/* Header */}
        <div style={{ background: T.panel, borderBottom: `1px solid ${T.border}`, padding: "16px 28px", display: "flex", alignItems: "center", gap: 14, position: "sticky", top: 0, zIndex: 10 }}>
          <button onClick={() => setView("home")} style={{ background: T.bgDeep, border: `1px solid ${T.border}`, color: T.inkMid, padding: "7px 16px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>← Inicio</button>
          <span style={{ fontSize: 24 }}>{activeModule.emoji}</span>
          <div>
            <div style={{ fontSize: 11, color, fontWeight: 600, letterSpacing: 1 }}>MÓDULO {activeModule.id}</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: T.ink, fontFamily: "'Crimson Pro', serif" }}>{activeModule.title}</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: `1px solid ${T.border}`, display: "flex", paddingLeft: 28, background: T.panel }}>
          {[["learn", "📚 Lecciones"], ["resources", `🔖 Recursos (${activeModule.resources.length})`]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ background: "none", border: "none", borderBottom: tab === key ? `3px solid ${color}` : "3px solid transparent", padding: "12px 20px", cursor: "pointer", fontSize: 14, color: tab === key ? color : T.inkMid, fontWeight: tab === key ? 600 : 400, fontFamily: "inherit", transition: "all 0.15s" }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 24px 60px" }}>

          {/* LESSONS TAB */}
          {tab === "learn" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {activeModule.lessons.map((les, i) => {
                const done = progress.completedLessons[les.id];
                const typeConf = {
                  concept: { label: "CONCEPTO", bg: T.blueLt, fg: T.blue },
                  exercise: { label: "EJERCICIO", bg: T.amberLt, fg: T.terra },
                  challenge: { label: "PROYECTO", bg: T.violetLt, fg: T.violet },
                  quiz: { label: "QUIZ", bg: T.greenLt, fg: T.green },
                }[les.type] || {};
                return (
                  <div key={les.id} onClick={() => { setActiveLessonId(les.id); setView("lesson"); }}
                    style={{ background: T.panel, border: `1.5px solid ${done ? color : T.border}`, borderRadius: 10, padding: "18px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 4px 12px ${color}15`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = done ? color : T.border; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: done ? color + "15" : T.bgDeep, border: `2px solid ${done ? color : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: done ? color : T.inkFaint, fontWeight: 700, fontSize: 14 }}>
                      {done ? "✓" : i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: typeConf.fg, background: typeConf.bg, padding: "2px 8px", borderRadius: 2 }}>{typeConf.label}</span>
                        {les.duration && <span style={{ fontSize: 11, color: T.inkFaint }}>⏱ {les.duration}</span>}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, fontFamily: "'Crimson Pro', serif" }}>{les.title}</div>
                    </div>
                    <div style={{ color: T.inkFaint, fontSize: 18 }}>→</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* RESOURCES TAB */}
          {tab === "resources" && (
            <div>
              <p style={{ color: T.inkMid, fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
                Recursos cuidadosamente seleccionados para reforzar los temas de este módulo. Son opcionales pero altamente recomendados.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {activeModule.resources.map((res, i) => {
                  const typeColors = { book: T.violet, video: "#dc2626", practice: T.green, project: T.amber };
                  const typeLabels = { book: "LIBRO", video: "VIDEO", practice: "PRÁCTICA", project: "PROYECTO" };
                  const tc = typeColors[res.type] || T.inkMid;
                  return (
                    <div key={i} style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 10, padding: 20, borderLeft: `4px solid ${tc}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                            <span style={{ fontSize: 18 }}>{res.icon}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: tc }}>{typeLabels[res.type]}</span>
                          </div>
                          <h4 style={{ fontSize: 16, fontWeight: 600, color: T.ink, marginBottom: 8, fontFamily: "'Crimson Pro', serif" }}>{res.title}</h4>
                          <p style={{ fontSize: 13, color: T.inkMid, lineHeight: 1.6 }}>{res.detail}</p>
                        </div>
                        {res.url && (
                          <a href={res.url} target="_blank" rel="noopener noreferrer"
                            style={{ flexShrink: 0, background: tc + "15", color: tc, border: `1px solid ${tc}`, padding: "7px 16px", borderRadius: 6, textDecoration: "none", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}
                            onClick={e => e.stopPropagation()}>
                            Ver →
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── LESSON VIEW ── */
  if (view === "lesson" && activeLesson && activeModule) {
    const { color } = activeModule;
    const isDone = progress.completedLessons[activeLesson.id];

    const markDone = () => completeLesson(activeLesson.id);

    return (
      <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap'); * { box-sizing: border-box; }`}</style>

        {/* Nav */}
        <div style={{ background: T.panel, borderBottom: `1px solid ${T.border}`, padding: "14px 28px", display: "flex", alignItems: "center", gap: 14, position: "sticky", top: 0, zIndex: 10 }}>
          <button onClick={() => setView("module")} style={{ background: T.bgDeep, border: `1px solid ${T.border}`, color: T.inkMid, padding: "7px 16px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>← {activeModule.title}</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, fontFamily: "'Crimson Pro', serif" }}>{activeLesson.title}</div>
            {activeLesson.duration && <div style={{ fontSize: 11, color: T.inkFaint }}>⏱ {activeLesson.duration}</div>}
          </div>
          {isDone && <span style={{ fontSize: 12, color: color, fontWeight: 600, background: color + "15", padding: "4px 12px", borderRadius: 4 }}>✓ Completado</span>}
        </div>

        <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 24px 80px" }}>

          {/* CONCEPT */}
          {activeLesson.type === "concept" && (
            <>
              <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 12, padding: 28, marginBottom: 20 }}>
                {renderContent(activeLesson.content)}
              </div>
              <button onClick={() => { markDone(); setView("module"); }}
                style={{ background: color, color: "#fff", border: "none", padding: "12px 28px", borderRadius: 8, cursor: "pointer", fontSize: 15, fontWeight: 600, fontFamily: "inherit" }}>
                ✓ Marcar como leído y continuar
              </button>
            </>
          )}

          {/* EXERCISE / CHALLENGE */}
          {(activeLesson.type === "exercise" || activeLesson.type === "challenge") && (
            <>
              {activeLesson.type === "challenge" && (
                <div style={{ background: T.violetLt, border: `1px solid ${T.violet}`, borderRadius: 8, padding: "10px 16px", marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 18 }}>🏆</span>
                  <span style={{ fontSize: 13, color: T.violet, fontWeight: 600 }}>Proyecto integrador del módulo — tómate tu tiempo, es el ejercicio más importante</span>
                </div>
              )}
              <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 12, padding: 28, marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: T.terra, marginBottom: 14 }}>ENUNCIADO</div>
                {renderContent(activeLesson.scenario)}
              </div>

              <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                <button onClick={() => setShowHint(p => ({ ...p, [activeLesson.id]: !p[activeLesson.id] }))}
                  style={{ background: T.amberLt, border: `1px solid ${T.amber}`, color: T.terra, padding: "9px 18px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 500 }}>
                  {showHint[activeLesson.id] ? "Ocultar" : "💡 Ver pista"}
                </button>
                <button onClick={() => { setShowSolution(p => ({ ...p, [activeLesson.id]: !p[activeLesson.id] })); markDone(); }}
                  style={{ background: T.greenLt, border: `1px solid ${T.green}`, color: T.green, padding: "9px 18px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 500 }}>
                  {showSolution[activeLesson.id] ? "Ocultar" : "✓ Ver solución"}
                </button>
              </div>

              {showHint[activeLesson.id] && (
                <div style={{ background: T.amberLt, border: `1px solid ${T.amber}`, borderRadius: 8, padding: 18, marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.terra, marginBottom: 8, letterSpacing: 1 }}>PISTA</div>
                  <p style={{ fontSize: 14, color: T.inkMid, lineHeight: 1.6, margin: 0 }}>{activeLesson.hint}</p>
                </div>
              )}

              {showSolution[activeLesson.id] && (
                <>
                  <div style={{ background: T.panel, border: `1px solid ${T.green}`, borderRadius: 12, padding: 24, marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: T.green, marginBottom: 14, letterSpacing: 1 }}>SOLUCIÓN COMENTADA</div>
                    <CodeBlock code={activeLesson.solution} />
                  </div>
                  {activeLesson.keyPoints && (
                    <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 10, padding: 20 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: T.terra, marginBottom: 12, letterSpacing: 1 }}>CONCEPTOS CLAVE DE ESTA SOLUCIÓN</div>
                      {activeLesson.keyPoints.map((kp, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                          <span style={{ color: color, flexShrink: 0, fontWeight: 700 }}>◆</span>
                          <span style={{ fontSize: 13.5, color: T.inkMid, lineHeight: 1.6 }}>{kp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* QUIZ */}
          {activeLesson.type === "quiz" && (
            <>
              <p style={{ fontSize: 14, color: T.inkMid, marginBottom: 24, lineHeight: 1.6 }}>
                Verifica tu comprensión con estas preguntas. No te preocupes si no aciertas — la explicación de cada respuesta es parte del aprendizaje.
              </p>
              {activeLesson.questions.map((q, qi) => {
                const ansKey = `${activeLesson.id}-${qi}`;
                const selected = progress.quizAnswers[ansKey];
                const submitted = progress.quizSubmitted[ansKey];
                const isCorrect = selected === q.correct;

                return (
                  <div key={qi} style={{ background: T.panel, border: `1px solid ${submitted ? (isCorrect ? T.green : "#dc2626") : T.border}`, borderRadius: 12, padding: 24, marginBottom: 16, transition: "border-color 0.3s" }}>
                    <div style={{ fontSize: 11, color: T.inkFaint, fontWeight: 600, letterSpacing: 1, marginBottom: 10 }}>PREGUNTA {qi + 1} DE {activeLesson.questions.length}</div>
                    <p style={{ fontSize: 15, color: T.ink, fontWeight: 500, marginBottom: 18, lineHeight: 1.6, fontFamily: "'Crimson Pro', serif" }}>{q.q}</p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                      {q.opts.map((opt, oi) => {
                        let bg = T.bgDeep, border = T.border, col = T.inkMid;
                        if (submitted) {
                          if (oi === q.correct) { bg = T.greenLt; border = T.green; col = T.green; }
                          else if (oi === selected && !isCorrect) { bg = T.redLt; border = "#dc2626"; col = "#dc2626"; }
                        } else if (oi === selected) { bg = color + "15"; border = color; col = color; }
                        return (
                          <div key={oi} onClick={() => !submitted && updateProgress({ quizAnswers: { ...progress.quizAnswers, [ansKey]: oi } })}
                            style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 8, padding: "11px 16px", cursor: submitted ? "default" : "pointer", color: col, fontSize: 14, lineHeight: 1.5, transition: "all 0.15s" }}>
                            <span style={{ fontWeight: 700, marginRight: 8 }}>{String.fromCharCode(65 + oi)}.</span>{opt}
                          </div>
                        );
                      })}
                    </div>

                    {!submitted ? (
                      <button disabled={selected === undefined}
                        onClick={() => {
                          updateProgress({ quizSubmitted: { ...progress.quizSubmitted, [ansKey]: true } });
                          if (qi === activeLesson.questions.length - 1) markDone();
                        }}
                        style={{ background: selected !== undefined ? color : T.bgDeep, color: selected !== undefined ? "#fff" : T.inkFaint, border: "none", padding: "10px 24px", borderRadius: 7, cursor: selected !== undefined ? "pointer" : "not-allowed", fontFamily: "inherit", fontSize: 13, fontWeight: 600 }}>
                        Verificar respuesta
                      </button>
                    ) : (
                      <div style={{ background: isCorrect ? T.greenLt : T.redLt, border: `1px solid ${isCorrect ? T.green : "#dc2626"}`, borderRadius: 8, padding: 16 }}>
                        <div style={{ color: isCorrect ? T.green : "#dc2626", fontWeight: 700, marginBottom: 6, fontSize: 13 }}>
                          {isCorrect ? "✓ ¡Correcto!" : "✗ No exactamente"}
                        </div>
                        <p style={{ color: T.inkMid, fontSize: 13.5, margin: 0, lineHeight: 1.65 }}>{q.explain}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}
