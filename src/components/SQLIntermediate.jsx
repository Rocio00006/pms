import { useState, useEffect, useRef } from "react";

const THEME = {
  bg: "#0a0e14",
  panel: "#0f1520",
  border: "#1e2d3d",
  accent: "#00d4ff",
  green: "#00ff88",
  yellow: "#ffd700",
  red: "#ff4757",
  orange: "#ff6b35",
  text: "#c9d1d9",
  dim: "#58a6b0",
  code: "#1a2535",
};

// ─── CURRICULUM ────────────────────────────────────────────────────────────────

const MODULES = [
  {
    id: 1,
    title: "Joins Avanzados & Subqueries",
    icon: "🔗",
    xp: 100,
    description: "El núcleo del SQL: dominar cómo relacionar datos complejos",
    lessons: [
      {
        id: "1a",
        type: "concept",
        title: "LATERAL JOIN: el join que itera",
        content: `Un LATERAL JOIN permite que la subconsulta del lado derecho haga referencia a columnas de la tabla del lado izquierdo — es decir, se ejecuta una vez por cada fila de la tabla principal.

**Cuándo usarlo:**
- Top-N por grupo (los 3 pedidos más recientes de cada cliente)
- Calcular valores dependientes de cada fila sin CTEs anidados
- Generar series dinámicas por fila

**Sintaxis:**
\`\`\`sql
SELECT c.nombre, ult.*
FROM clientes c
CROSS JOIN LATERAL (
  SELECT total, fecha
  FROM pedidos p
  WHERE p.cliente_id = c.id
  ORDER BY fecha DESC
  LIMIT 3
) ult;
\`\`\`

La diferencia con un subquery normal: en un subquery correlacionado solo puedes retornar un valor escalar. Con LATERAL puedes retornar múltiples filas y columnas.`,
      },
      {
        id: "1b",
        type: "exercise",
        title: "Ejercicio: Top ventas por vendedor",
        scenario: `Tienes las tablas:
  vendedores(id, nombre, region)
  ventas(id, vendedor_id, monto, fecha, producto)

Escribe una query que retorne para cada vendedor: su nombre, región, y el monto de su **mejor venta individual** junto con el producto vendido. Solo incluye vendedores que tengan al menos 1 venta.`,
        hint: "Piensa en LATERAL con ORDER BY monto DESC LIMIT 1. También se puede con DISTINCT ON.",
        solution: `-- Solución con LATERAL JOIN
SELECT v.nombre, v.region, mejor.monto, mejor.producto
FROM vendedores v
JOIN LATERAL (
  SELECT monto, producto
  FROM ventas vt
  WHERE vt.vendedor_id = v.id
  ORDER BY monto DESC
  LIMIT 1
) mejor ON true;

-- Alternativa elegante con DISTINCT ON
SELECT DISTINCT ON (v.id)
  v.nombre, v.region, vt.monto, vt.producto
FROM vendedores v
JOIN ventas vt ON vt.vendedor_id = v.id
ORDER BY v.id, vt.monto DESC;`,
        keyPoints: [
          "LATERAL permite referenciar la tabla padre en la subquery",
          "JOIN LATERAL ON true es equivalente a CROSS JOIN LATERAL cuando hay filas",
          "DISTINCT ON es una alternativa PostgreSQL-específica muy eficiente para top-1 por grupo",
        ],
      },
      {
        id: "1c",
        type: "quiz",
        title: "Quiz: Self-joins y anti-joins",
        questions: [
          {
            q: "¿Cuál es la diferencia entre NOT IN y NOT EXISTS cuando hay NULLs en la subquery?",
            options: [
              "No hay diferencia, son equivalentes",
              "NOT IN retorna vacío si hay algún NULL en el resultado de la subquery; NOT EXISTS maneja NULLs correctamente",
              "NOT EXISTS retorna vacío con NULLs; NOT IN no",
              "Ambos ignoran NULLs automáticamente",
            ],
            correct: 1,
            explanation:
              "NOT IN con NULLs en la subquery produce UNKNOWN en toda comparación y retorna 0 filas. NOT EXISTS evalúa existencia, no igualdad, y no tiene este problema. Siempre preferir NOT EXISTS o LEFT JOIN ... WHERE IS NULL.",
          },
          {
            q: "¿Qué retorna este query?\nSELECT a.id FROM t a JOIN t b ON a.id < b.id",
            options: [
              "Un producto cartesiano completo",
              "Todos los pares donde a.id es menor que b.id (self-join con pares únicos)",
              "Un error porque no puedes hacer JOIN de una tabla consigo misma",
              "Solo las filas donde a.id = b.id - 1",
            ],
            correct: 1,
            explanation:
              "Es un self-join válido. Se asignan alias diferentes (a, b) para la misma tabla. La condición a.id < b.id genera todas las combinaciones sin repetición — útil para comparar todos los pares de filas.",
          },
          {
            q: "¿Para qué sirve un FULL OUTER JOIN?",
            options: [
              "Para obtener solo las filas que coinciden en ambas tablas",
              "Para obtener todas las filas de ambas tablas, con NULL donde no haya coincidencia",
              "Para mejorar el rendimiento de JOINs grandes",
              "Es sinónimo de CROSS JOIN",
            ],
            correct: 1,
            explanation:
              "FULL OUTER JOIN retorna: filas que coinciden (como INNER JOIN) + filas de la izquierda sin match (con NULL a la derecha) + filas de la derecha sin match (con NULL a la izquierda). Útil para reconciliar dos conjuntos de datos.",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Window Functions",
    icon: "🪟",
    xp: 150,
    description: "Cálculos analíticos potentes sin colapsar filas",
    lessons: [
      {
        id: "2a",
        type: "concept",
        title: "Anatomía de una Window Function",
        content: `Las window functions calculan valores sobre un conjunto de filas relacionadas con la fila actual, **sin agrupar** el resultado.

**Estructura:**
\`\`\`sql
funcion() OVER (
  PARTITION BY columna   -- divide en "ventanas"
  ORDER BY columna       -- orden dentro de la ventana
  ROWS/RANGE BETWEEN ... -- frame de la ventana
)
\`\`\`

**Funciones clave:**
| Función | Descripción |
|---------|-------------|
| ROW_NUMBER() | Número único, siempre consecutivo |
| RANK() | Igual valor = mismo rank, salta números |
| DENSE_RANK() | Igual valor = mismo rank, no salta |
| LAG(col, n) | Valor de n filas atrás |
| LEAD(col, n) | Valor de n filas adelante |
| FIRST_VALUE(col) | Primer valor del frame |
| SUM/AVG OVER(...) | Acumulado o móvil |

**Frame clause:**
\`\`\`sql
-- Running total
SUM(monto) OVER (ORDER BY fecha 
  ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)

-- Media móvil de 7 días
AVG(valor) OVER (ORDER BY fecha 
  ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)
\`\`\``,
      },
      {
        id: "2b",
        type: "challenge",
        title: "🔥 Desafío: Análisis de cohortes de retención",
        difficulty: "DIFÍCIL",
        scenario: `Tabla: eventos(user_id, fecha, tipo_evento)
  tipo_evento puede ser: 'registro', 'compra', 'visita'

**Objetivo:** Calcular la retención de cohortes mensual.
Una cohorte es el mes en que el usuario se registró.
La retención del mes N es el % de usuarios de esa cohorte que tuvieron actividad en el mes de registro + N meses.

Escribe la query completa.`,
        hint: "Necesitarás: DATE_TRUNC para agrupar por mes, JOIN para cruzar el mes de registro con meses de actividad, y window functions o GROUP BY anidado.",
        solution: `WITH cohortes AS (
  -- Mes de registro de cada usuario
  SELECT 
    user_id,
    DATE_TRUNC('month', fecha) AS cohorte_mes
  FROM eventos
  WHERE tipo_evento = 'registro'
),
actividad AS (
  -- Todos los meses donde cada usuario tuvo actividad
  SELECT DISTINCT
    user_id,
    DATE_TRUNC('month', fecha) AS mes_activo
  FROM eventos
),
cohort_activity AS (
  SELECT
    c.cohorte_mes,
    a.mes_activo,
    -- Número de meses desde el registro (0 = mes de registro)
    EXTRACT(YEAR FROM AGE(a.mes_activo, c.cohorte_mes)) * 12 +
    EXTRACT(MONTH FROM AGE(a.mes_activo, c.cohorte_mes)) AS mes_n,
    COUNT(DISTINCT c.user_id) AS usuarios_activos
  FROM cohortes c
  JOIN actividad a ON a.user_id = c.user_id
    AND a.mes_activo >= c.cohorte_mes
  GROUP BY c.cohorte_mes, a.mes_activo
),
tamano_cohorte AS (
  SELECT cohorte_mes, COUNT(*) AS total_usuarios
  FROM cohortes
  GROUP BY cohorte_mes
)
SELECT
  ca.cohorte_mes,
  ca.mes_n,
  ca.usuarios_activos,
  tc.total_usuarios,
  ROUND(100.0 * ca.usuarios_activos / tc.total_usuarios, 1) AS retencion_pct
FROM cohort_activity ca
JOIN tamano_cohorte tc ON tc.cohorte_mes = ca.cohorte_mes
ORDER BY ca.cohorte_mes, ca.mes_n;`,
        keyPoints: [
          "DATE_TRUNC('month', fecha) trunca al primer día del mes",
          "AGE() entre dos fechas retorna un intervalo; EXTRACT puede sacar años y meses",
          "Los CTEs encadenados son la forma más legible de construir queries complejos",
          "DISTINCT ON o DISTINCT son cruciales para no contar actividad duplicada",
        ],
      },
      {
        id: "2c",
        type: "quiz",
        title: "Quiz: Window Functions avanzado",
        questions: [
          {
            q: "¿Cuál es la diferencia entre ROWS BETWEEN y RANGE BETWEEN en el frame clause?",
            options: [
              "Son sinónimos, no hay diferencia",
              "ROWS cuenta filas físicas; RANGE agrupa filas con el mismo valor ORDER BY en el mismo frame",
              "RANGE solo funciona con fechas",
              "ROWS es más lento que RANGE",
            ],
            correct: 1,
            explanation:
              "ROWS trabaja con posiciones físicas (fila 1, fila 2...). RANGE trabaja con valores lógicos: todas las filas con el mismo valor de ORDER BY caen en el mismo 'límite'. Esto afecta cómo se calculan acumulados cuando hay empates.",
          },
          {
            q: "¿Qué produce NTILE(4) OVER (ORDER BY salario)?",
            options: [
              "Cuartiles: divide el resultado en 4 grupos iguales y asigna 1,2,3 o 4",
              "Retorna el percentil exacto de cada salario",
              "Agrupa por salario en 4 buckets de igual valor",
              "Es equivalente a RANK() dividido entre 4",
            ],
            correct: 0,
            explanation:
              "NTILE(n) divide el conjunto ordenado en n grupos lo más iguales posible y asigna el número de grupo (1 a n) a cada fila. NTILE(4) = cuartiles, NTILE(100) = percentiles.",
          },
          {
            q: "¿Cuándo usarías FILTER(WHERE ...) con una window function?",
            options: [
              "Para filtrar filas antes del ORDER BY",
              "Para aplicar la función solo a filas que cumplen una condición dentro de la ventana",
              "FILTER no es compatible con window functions",
              "Para reemplazar el PARTITION BY",
            ],
            correct: 1,
            explanation:
              "FILTER(WHERE condicion) dentro de una función de agregación (incluyendo sobre ventanas) aplica la función solo a las filas que pasan la condición. Ejemplo: COUNT(*) FILTER(WHERE tipo='compra') OVER (PARTITION BY user_id)",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "CTEs & Recursividad",
    icon: "♻️",
    xp: 130,
    description: "Queries complejos y estructuras jerárquicas",
    lessons: [
      {
        id: "3a",
        type: "concept",
        title: "CTEs: materialización y recursividad",
        content: `**CTE básico (WITH):**
Un CTE nombra una subquery para reusarla. En PostgreSQL, por defecto los CTEs se materializan (ejecutan una sola vez y el resultado se almacena).

\`\`\`sql
WITH ventas_2024 AS (
  SELECT * FROM ventas WHERE EXTRACT(YEAR FROM fecha) = 2024
),
top_clientes AS (
  SELECT cliente_id, SUM(monto) total
  FROM ventas_2024
  GROUP BY cliente_id
  HAVING SUM(monto) > 10000
)
SELECT c.nombre, tc.total
FROM top_clientes tc
JOIN clientes c ON c.id = tc.cliente_id;
\`\`\`

**CTE Recursivo (WITH RECURSIVE):**
Permite que un CTE se referencie a sí mismo. Estructura obligatoria:
1. **Anchor query**: caso base (sin recursión)
2. **UNION ALL**
3. **Recursive query**: referencia al CTE mismo + condición de parada

\`\`\`sql
WITH RECURSIVE jerarquia AS (
  -- Anchor: el nodo raíz
  SELECT id, nombre, parent_id, 0 AS nivel
  FROM empleados
  WHERE parent_id IS NULL
  
  UNION ALL
  
  -- Recursivo: hijos del nivel actual
  SELECT e.id, e.nombre, e.parent_id, j.nivel + 1
  FROM empleados e
  JOIN jerarquia j ON e.parent_id = j.id
)
SELECT * FROM jerarquia ORDER BY nivel, nombre;
\`\`\`

**⚠️ Peligro:** Sin condición de parada adecuada, un CTE recursivo puede ser infinito. Usar \`WHERE nivel < 100\` como límite de seguridad.`,
      },
      {
        id: "3b",
        type: "challenge",
        title: "🔥 Desafío: Árbol de categorías y rutas",
        difficulty: "DIFÍCIL",
        scenario: `Tabla: categorias(id, nombre, parent_id)
  parent_id es NULL para categorías raíz.

**Parte 1:** Escribe un query recursivo que retorne cada categoría con su "ruta completa" en formato string. Ejemplo: "Electrónica > Computadoras > Laptops"

**Parte 2:** Dado un categoria_id específico (:target_id), encuentra todos sus ancestros (el camino desde la raíz hasta ese nodo).`,
        hint: "Para la ruta, concatena los nombres en la parte recursiva. Para ancestros, cambia la dirección: parte del nodo y sube por parent_id.",
        solution: `-- Parte 1: Ruta completa de cada categoría
WITH RECURSIVE rutas AS (
  -- Anchor: categorías raíz
  SELECT id, nombre, parent_id, nombre::text AS ruta
  FROM categorias
  WHERE parent_id IS NULL
  
  UNION ALL
  
  -- Recursivo: concatenar nombre del hijo
  SELECT c.id, c.nombre, c.parent_id,
         r.ruta || ' > ' || c.nombre
  FROM categorias c
  JOIN rutas r ON c.parent_id = r.id
)
SELECT id, nombre, ruta
FROM rutas
ORDER BY ruta;

-- Parte 2: Ancestros de un nodo específico
WITH RECURSIVE ancestros AS (
  -- Anchor: el nodo objetivo
  SELECT id, nombre, parent_id, 0 AS nivel
  FROM categorias
  WHERE id = :target_id
  
  UNION ALL
  
  -- Recursivo: subir hacia el padre
  SELECT c.id, c.nombre, c.parent_id, a.nivel + 1
  FROM categorias c
  JOIN ancestros a ON c.id = a.parent_id
)
SELECT id, nombre, nivel
FROM ancestros
ORDER BY nivel DESC; -- nivel 0 es el nodo, el más alto es la raíz`,
        keyPoints: [
          "La concatenación de strings en el recursivo construye la ruta incrementalmente",
          "Para 'subir' en una jerarquía, el JOIN va al revés: JOIN ON c.id = a.parent_id",
          "Casting explícito (nombre::text) necesario cuando el anchor define el tipo",
          "CYCLE detection disponible en PostgreSQL 14+: CYCLE id SET is_cycle TO true",
        ],
      },
      {
        id: "3c",
        type: "quiz",
        title: "Quiz: CTEs y optimización",
        questions: [
          {
            q: "En PostgreSQL 12+, ¿qué hace la hint MATERIALIZED vs NOT MATERIALIZED en un CTE?",
            options: [
              "Solo es sintaxis decorativa, no afecta el plan",
              "MATERIALIZED fuerza que el CTE se ejecute una sola vez y se almacene; NOT MATERIALIZED permite al optimizador inlinear el CTE como subquery",
              "MATERIALIZED crea una tabla temporal; NOT MATERIALIZED usa memoria RAM",
              "Son equivalentes en rendimiento",
            ],
            correct: 1,
            explanation:
              "Desde PG12, el optimizador puede inlinear CTEs (NOT MATERIALIZED) si estima que es más eficiente. Con MATERIALIZED siempre se ejecuta una vez (útil si el CTE se usa múltiples veces o tiene efectos secundarios como funciones volátiles).",
          },
          {
            q: "¿Cuál es el límite de recursión por defecto en PostgreSQL para CTEs recursivos?",
            options: [
              "100 iteraciones",
              "1000 iteraciones",
              "No hay límite, puede ser infinito",
              "Depende de la memoria disponible",
            ],
            correct: 1,
            explanation:
              "El parámetro max_recursion_depth en PostgreSQL controla esto y por defecto no existe un límite explícito — se detiene cuando la parte recursiva no produce más filas. Sin embargo, una recursión infinita consumirá toda la memoria. Es buena práctica añadir un contador de nivel y limitar con WHERE.",
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Índices & Performance",
    icon: "⚡",
    xp: 200,
    description: "El arte de hacer queries ultra-rápidos",
    lessons: [
      {
        id: "4a",
        type: "concept",
        title: "Tipos de índices en PostgreSQL",
        content: `PostgreSQL ofrece múltiples tipos de índices, cada uno optimizado para casos específicos:

**B-Tree (por defecto):**
- Ideal para: igualdad (=), rangos (<, >, BETWEEN), ORDER BY, LIKE 'prefix%'
- ❌ No sirve para: LIKE '%suffix', full-text, arrays

**Hash:**
- Solo para igualdad (=)
- Más rápido que B-Tree para buscar un valor exacto
- ❌ No soporta rangos

**GIN (Generalized Inverted Index):**
- Ideal para: arrays (@>, <@), JSONB, full-text search
- Almacena los elementos individuales y mapea a filas

**GiST (Generalized Search Tree):**
- Ideal para: geoespacial (PostGIS), rangos (tsrange), geometrías
- Soporte para operadores especiales (&&, @>)

**BRIN (Block Range Index):**
- Índices muy pequeños para datos con correlación física (ej: timestamps de insert)
- Útil en tablas muy grandes con datos ordenados naturalmente

**Parciales:**
\`\`\`sql
-- Solo indexa filas activas (no las archivadas)
CREATE INDEX ON pedidos(cliente_id) WHERE estado = 'activo';
\`\`\`

**Compuestos:**
\`\`\`sql
-- Columnas en orden correcto según las queries más frecuentes
CREATE INDEX ON ventas(region, fecha, monto);
-- Sirve para: WHERE region=X, WHERE region=X AND fecha=Y, pero NO solo fecha
\`\`\`

**Covering index (INCLUDE):**
\`\`\`sql
-- El índice incluye columnas extra para evitar heap fetch
CREATE INDEX ON clientes(email) INCLUDE (nombre, plan);
-- Query SELECT nombre, plan FROM clientes WHERE email=X puede ser index-only scan
\`\`\``,
      },
      {
        id: "4b",
        type: "exercise",
        title: "Ejercicio: EXPLAIN ANALYZE — leer el plan",
        scenario: `Tienes este query lento (tabla con 10M filas):

\`\`\`sql
SELECT u.nombre, COUNT(o.id) as total_pedidos, SUM(o.monto) as total_gastado
FROM usuarios u
JOIN pedidos o ON o.usuario_id = u.id  
WHERE o.fecha >= '2024-01-01'
  AND o.estado = 'completado'
  AND u.pais = 'MX'
GROUP BY u.id, u.nombre
HAVING SUM(o.monto) > 500
ORDER BY total_gastado DESC;
\`\`\`

El EXPLAIN muestra Seq Scan en ambas tablas y un Hash Join. Costo total: 890,234.

**Pregunta:** ¿Qué índices crearías y por qué? Considera la selectividad de cada filtro.`,
        hint: "Analiza qué columnas están en WHERE, qué tan selectivas son, y si se puede hacer un index-only scan.",
        solution: `-- Análisis de selectividad:
-- o.fecha >= '2024-01-01': moderadamente selectivo (filtra ~25% si es 1 año de 4)
-- o.estado = 'completado': potencialmente muy selectivo si hay pocos estados
-- u.pais = 'MX': selectividad variable según distribución

-- Índice compuesto en pedidos (columna más selectiva primero, luego rango)
CREATE INDEX idx_pedidos_estado_fecha ON pedidos(estado, fecha, usuario_id)
  INCLUDE (monto);
-- Razonamiento: estado es igualdad (muy selectivo), fecha es rango,
-- usuario_id permite el join, monto evita el heap fetch para el SUM

-- Índice en usuarios para el filtro de país
CREATE INDEX idx_usuarios_pais ON usuarios(pais)
  INCLUDE (nombre);
-- Razonamiento: permite filtrar por país sin leer toda la tabla

-- El optimizador puede ahora hacer:
-- 1. Index Scan en pedidos por (estado='completado', fecha>=2024-01-01)
-- 2. Index Scan en usuarios por (pais='MX')  
-- 3. Hash Join entre los resultados filtrados
-- 4. GROUP BY y HAVING en el resultado pequeño

-- Para verificar, ejecutar:
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) SELECT ...;
-- Buscar: Index Scan, Index Only Scan (sin heap fetch), reducción de filas

-- NOTA: Índice parcial si 'completado' es el estado más consultado:
CREATE INDEX idx_pedidos_completados ON pedidos(fecha, usuario_id)
  INCLUDE (monto)
  WHERE estado = 'completado';
-- Más pequeño = más eficiente en cache`,
        keyPoints: [
          "En índices compuestos: primero columnas de igualdad, luego rangos",
          "INCLUDE evita el 'heap fetch' → Index Only Scan posible",
          "Índices parciales son más pequeños y eficientes cuando el filtro es fijo",
          "La selectividad determina si un índice vale la pena (< 5-10% de filas = buena candidata)",
        ],
      },
      {
        id: "4c",
        type: "challenge",
        title: "🔥 Desafío: Optimizar un query de reporting",
        difficulty: "MUY DIFÍCIL",
        scenario: `Este query de reporte corre en 45 segundos. Debe correr en < 2 segundos.

\`\`\`sql
SELECT 
  DATE_TRUNC('month', v.fecha) AS mes,
  p.categoria,
  p.subcategoria,
  r.nombre AS region,
  SUM(v.cantidad * v.precio_unitario) AS revenue,
  COUNT(DISTINCT v.cliente_id) AS clientes_unicos,
  AVG(v.precio_unitario) AS precio_promedio
FROM ventas v
JOIN productos p ON p.id = v.producto_id
JOIN regiones r ON r.id = v.region_id
WHERE v.fecha >= NOW() - INTERVAL '2 years'
GROUP BY 1, 2, 3, 4
ORDER BY 1 DESC, 5 DESC;
\`\`\`

ventas tiene 50M filas. productos: 100K. regiones: 500.

**Tareas:**
1. Identifica los cuellos de botella
2. Propón estrategias de optimización (índices, particionamiento, materialized views)
3. Escribe la implementación completa de tu solución`,
        hint: "Piensa más allá de índices: ¿esta query puede pre-computarse? ¿Los datos necesitan estar en la tabla principal para esta query?",
        solution: `-- ANÁLISIS DEL PROBLEMA:
-- 1. Seq scan inevitable en 50M filas para WHERE fecha >= NOW()-2y (sin índice)
-- 2. Múltiples JOINs a tablas medianas
-- 3. GROUP BY con COUNT(DISTINCT) es costoso
-- 4. Este es claramente un query de BI/reporting → candidato a Materialized View

-- ═══════════════════════════════════════
-- SOLUCIÓN 1: Índices base
-- ═══════════════════════════════════════
CREATE INDEX idx_ventas_fecha_brin ON ventas USING BRIN(fecha);
-- BRIN es pequeño y eficiente para fechas de insert correlacionadas

CREATE INDEX idx_ventas_cobertura ON ventas(fecha, producto_id, region_id, cliente_id)
  INCLUDE (cantidad, precio_unitario);
-- Cubre todas las columnas necesarias

-- ═══════════════════════════════════════
-- SOLUCIÓN 2: Particionamiento por rango de fecha
-- ═══════════════════════════════════════
-- Crear tabla particionada (requiere migración)
CREATE TABLE ventas_particionadas (
  LIKE ventas INCLUDING ALL
) PARTITION BY RANGE (fecha);

CREATE TABLE ventas_2023 PARTITION OF ventas_particionadas
  FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');
CREATE TABLE ventas_2024 PARTITION OF ventas_particionadas
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
-- Partition pruning: el planner solo lee particiones relevantes

-- ═══════════════════════════════════════  
-- SOLUCIÓN 3: Materialized View (la más efectiva para reporting)
-- ═══════════════════════════════════════
CREATE MATERIALIZED VIEW mv_ventas_mensual AS
SELECT 
  DATE_TRUNC('month', v.fecha) AS mes,
  p.categoria,
  p.subcategoria,
  r.nombre AS region,
  SUM(v.cantidad * v.precio_unitario) AS revenue,
  COUNT(DISTINCT v.cliente_id) AS clientes_unicos,
  AVG(v.precio_unitario) AS precio_promedio
FROM ventas v
JOIN productos p ON p.id = v.producto_id
JOIN regiones r ON r.id = v.region_id
GROUP BY 1, 2, 3, 4
WITH DATA;

-- Índice en la MV para queries frecuentes
CREATE INDEX ON mv_ventas_mensual(mes DESC, revenue DESC);
CREATE INDEX ON mv_ventas_mensual(categoria, mes);

-- Refresh programado (cron o pg_cron)
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_ventas_mensual;
-- CONCURRENTLY no bloquea lecturas durante el refresh

-- La query original ahora es:
SELECT * FROM mv_ventas_mensual
WHERE mes >= DATE_TRUNC('month', NOW() - INTERVAL '2 years')
ORDER BY mes DESC, revenue DESC;
-- ≈ 0.1ms en vez de 45s

-- ═══════════════════════════════════════
-- BONUS: pg_cron para refresh automático
-- ═══════════════════════════════════════
SELECT cron.schedule(
  'refresh-ventas-mv',
  '0 2 * * *',  -- cada día a las 2am
  'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_ventas_mensual'
);`,
        keyPoints: [
          "Materialized Views: pre-computar aggregaciones pesadas de reporting",
          "REFRESH CONCURRENTLY requiere un unique index pero no bloquea lecturas",
          "BRIN ideal para tablas con datos correlacionados cronológicamente",
          "Particionamiento: el planner poda particiones fuera del rango WHERE automáticamente",
          "Para BI/dashboards, siempre pensar en capas de pre-agregación",
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Transacciones & Concurrencia",
    icon: "🔒",
    xp: 180,
    description: "ACID, niveles de aislamiento y patrones para alta concurrencia",
    lessons: [
      {
        id: "5a",
        type: "concept",
        title: "MVCC y niveles de aislamiento",
        content: `PostgreSQL usa **MVCC (Multi-Version Concurrency Control)**: en vez de bloquear filas al leer, mantiene múltiples versiones de cada fila, permitiendo que lecturas no bloqueen escrituras.

**Niveles de aislamiento (SQL estándar):**

| Nivel | Dirty Read | Non-Repeatable Read | Phantom Read |
|-------|-----------|---------------------|--------------|
| READ UNCOMMITTED | Posible* | Posible | Posible |
| READ COMMITTED (default) | No | Posible | Posible |
| REPEATABLE READ | No | No | No* |
| SERIALIZABLE | No | No | No |

*PostgreSQL no tiene dirty reads nunca. REPEATABLE READ en PG también previene phantoms.

**Anomalías de concurrencia:**
- **Dirty Read**: leer datos de una transacción no committed (PG nunca)
- **Non-Repeatable Read**: leer el mismo dato 2 veces y obtener valores distintos
- **Phantom Read**: una segunda lectura del mismo range retorna filas nuevas
- **Write Skew**: dos transacciones leen el mismo dato y escriben basándose en ese valor (requiere SERIALIZABLE para prevenir)

**FOR UPDATE / FOR SHARE:**
\`\`\`sql
-- Bloqueo pesimista: nadie más puede actualizar esta fila hasta commit
SELECT * FROM inventario WHERE producto_id = 5 FOR UPDATE;

-- SKIP LOCKED: saltar filas bloqueadas (queue processing)
SELECT * FROM tareas WHERE estado = 'pendiente' 
  FOR UPDATE SKIP LOCKED LIMIT 1;
\`\`\`

**Advisory Locks:**
\`\`\`sql
-- Lock a nivel de aplicación, por ID arbitrario
SELECT pg_try_advisory_lock(12345); -- non-blocking
SELECT pg_advisory_lock(12345);     -- blocking
SELECT pg_advisory_unlock(12345);
\`\`\``,
      },
      {
        id: "5b",
        type: "challenge",
        title: "🔥 Desafío: Sistema de inventario concurrente",
        difficulty: "DIFÍCIL",
        scenario: `Tienes una tabla: inventario(producto_id, stock, reservado, disponible)
  donde disponible = stock - reservado

Múltiples workers intentan reservar unidades simultáneamente.
Si dos workers leen disponible=10 al mismo tiempo y ambos reservan 8 unidades, el stock queda en -6.

**Tarea:** Diseña una función PostgreSQL que reserve N unidades de forma segura, manejando:
1. Concurrencia (evitar reservas que excedan el stock)
2. Que retorne éxito/fallo con mensaje claro
3. Implementa también un sistema de "cola de tareas" SKIP LOCKED`,
        hint: "La clave está en bloquear la fila ANTES de leer el valor disponible, o usar UPDATE con condición y verificar filas afectadas.",
        solution: `-- ═══════════════════════════════════════
-- Función de reserva con locking optimista (UPDATE atómico)
-- ═══════════════════════════════════════
CREATE OR REPLACE FUNCTION reservar_stock(
  p_producto_id INT,
  p_cantidad INT
) RETURNS TABLE(exito BOOLEAN, mensaje TEXT, stock_disponible INT)
LANGUAGE plpgsql AS $$
DECLARE
  v_filas_afectadas INT;
  v_disponible INT;
BEGIN
  -- UPDATE atómico: solo actualiza si hay suficiente stock
  -- Esto es seguro sin SELECT previo
  UPDATE inventario
  SET reservado = reservado + p_cantidad
  WHERE producto_id = p_producto_id
    AND (stock - reservado) >= p_cantidad;  -- condición atómica
  
  GET DIAGNOSTICS v_filas_afectadas = ROW_COUNT;
  
  IF v_filas_afectadas = 0 THEN
    -- No se pudo reservar: retornar stock actual
    SELECT stock - reservado INTO v_disponible
    FROM inventario WHERE producto_id = p_producto_id;
    
    RETURN QUERY SELECT 
      FALSE, 
      FORMAT('Stock insuficiente. Disponible: %s, Solicitado: %s', 
             v_disponible, p_cantidad),
      v_disponible;
  ELSE
    SELECT stock - reservado INTO v_disponible
    FROM inventario WHERE producto_id = p_producto_id;
    
    RETURN QUERY SELECT 
      TRUE,
      FORMAT('Reserva exitosa: %s unidades', p_cantidad),
      v_disponible;
  END IF;
END;
$$;

-- Uso:
SELECT * FROM reservar_stock(42, 5);

-- ═══════════════════════════════════════
-- Sistema de cola con SKIP LOCKED
-- ═══════════════════════════════════════
CREATE TABLE cola_tareas (
  id BIGSERIAL PRIMARY KEY,
  tipo VARCHAR(50),
  payload JSONB,
  estado VARCHAR(20) DEFAULT 'pendiente',
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  intentos INT DEFAULT 0,
  max_intentos INT DEFAULT 3
);

CREATE INDEX ON cola_tareas(estado, creado_en) 
  WHERE estado = 'pendiente';

-- Función worker: tomar una tarea de la cola
CREATE OR REPLACE FUNCTION tomar_tarea(p_tipo VARCHAR DEFAULT NULL)
RETURNS cola_tareas
LANGUAGE plpgsql AS $$
DECLARE
  v_tarea cola_tareas;
BEGIN
  SELECT * INTO v_tarea
  FROM cola_tareas
  WHERE estado = 'pendiente'
    AND (p_tipo IS NULL OR tipo = p_tipo)
    AND intentos < max_intentos
  ORDER BY creado_en
  LIMIT 1
  FOR UPDATE SKIP LOCKED;  -- salta filas que otro worker ya tomó
  
  IF v_tarea.id IS NOT NULL THEN
    UPDATE cola_tareas
    SET estado = 'procesando',
        intentos = intentos + 1
    WHERE id = v_tarea.id;
  END IF;
  
  RETURN v_tarea;
END;
$$;

-- Completar o fallar una tarea
CREATE OR REPLACE FUNCTION completar_tarea(p_id BIGINT, p_exito BOOLEAN)
RETURNS VOID LANGUAGE sql AS $$
  UPDATE cola_tareas
  SET estado = CASE WHEN p_exito THEN 'completado' ELSE 'fallido' END
  WHERE id = p_id;
$$;`,
        keyPoints: [
          "UPDATE atómico con condición es más seguro que SELECT + UPDATE separados",
          "GET DIAGNOSTICS ROW_COUNT verifica cuántas filas se actualizaron",
          "SKIP LOCKED: los workers toman tareas distintas sin esperarse",
          "El patrón UPDATE-where-condition-check es 'optimistic locking' sin versiones",
          "FOR UPDATE NOWAIT lanza error inmediato si la fila está bloqueada (vs SKIP que la ignora)",
        ],
      },
    ],
  },
  {
    id: 6,
    title: "JSONB & Datos Semi-estructurados",
    icon: "📦",
    xp: 120,
    description: "PostgreSQL como base de datos de documentos",
    lessons: [
      {
        id: "6a",
        type: "concept",
        title: "JSONB: operadores y patrones",
        content: `JSONB almacena JSON en formato binario descompuesto: búsquedas rápidas, soporta índices GIN.

**Operadores principales:**
\`\`\`sql
-- Acceso
datos->'clave'           -- retorna JSONB
datos->>'clave'          -- retorna TEXT
datos #> '{a,b,c}'       -- path array → JSONB
datos #>> '{a,b,c}'      -- path array → TEXT

-- Contención
datos @> '{"rol": "admin"}'    -- datos contiene ese objeto
'{"rol": "admin"}' <@ datos    -- es subconjunto de datos

-- Existencia de clave
datos ? 'email'                -- ¿existe la clave?
datos ?| ARRAY['email','tel']  -- ¿existe alguna?
datos ?& ARRAY['email','tel']  -- ¿existen todas?

-- Modificación (inmutable en JSONB, retorna nuevo valor)
jsonb_set(datos, '{direccion,ciudad}', '"CDMX"')
datos || '{"nuevo_campo": true}'::jsonb  -- merge
datos - 'campo_a_eliminar'               -- eliminar clave
\`\`\`

**Índice GIN para búsquedas en JSONB:**
\`\`\`sql
-- Índice general (soporta @>, ?, ?|, ?&)
CREATE INDEX ON usuarios USING GIN(datos);

-- Índice de path específico (más pequeño, para acceso frecuente)
CREATE INDEX ON usuarios USING GIN((datos->'tags'));

-- Índice funcional para una clave específica
CREATE INDEX ON usuarios((datos->>'email'));
-- Permite: WHERE datos->>'email' = 'x@y.com'
\`\`\`

**jsonb_to_recordset y jsonb_array_elements:**
\`\`\`sql
-- Expandir un array JSONB en filas
SELECT item.* 
FROM pedidos, 
     jsonb_to_recordset(datos->'items') AS item(producto_id INT, cantidad INT, precio NUMERIC);
\`\`\``,
      },
      {
        id: "6b",
        type: "exercise",
        title: "Ejercicio: Normalización desde JSONB",
        scenario: `Tienes una tabla legacy:
  eventos(id, metadata JSONB)

Donde metadata tiene esta estructura:
\`\`\`json
{
  "usuario": {"id": 123, "email": "x@y.com", "pais": "MX"},
  "accion": "compra",
  "items": [
    {"sku": "A1", "qty": 2, "precio": 49.99},
    {"sku": "B3", "qty": 1, "precio": 199.00}
  ],
  "timestamp": "2024-03-15T14:30:00Z"
}
\`\`\`

**Tarea:** Escribe un query que expanda estos datos en filas normalizadas, con una fila por item comprado, incluyendo: evento_id, usuario_id, email, pais, accion, sku, qty, precio, timestamp.`,
        hint: "jsonb_array_elements expande el array. Combínalo con acceso de campos del objeto principal.",
        solution: `SELECT
  e.id AS evento_id,
  (e.metadata #>> '{usuario,id}')::INT AS usuario_id,
  e.metadata #>> '{usuario,email}' AS email,
  e.metadata #>> '{usuario,pais}' AS pais,
  e.metadata->>'accion' AS accion,
  item->>'sku' AS sku,
  (item->>'qty')::INT AS qty,
  (item->>'precio')::NUMERIC AS precio,
  (e.metadata->>'timestamp')::TIMESTAMPTZ AS timestamp
FROM eventos e,
     jsonb_array_elements(e.metadata->'items') AS item
WHERE e.metadata->>'accion' = 'compra';

-- Alternativa con jsonb_to_recordset (más tipado):
SELECT
  e.id AS evento_id,
  (e.metadata #>> '{usuario,id}')::INT AS usuario_id,
  items.*
FROM eventos e,
     jsonb_to_recordset(e.metadata->'items') AS items(
       sku TEXT, 
       qty INT, 
       precio NUMERIC
     );`,
        keyPoints: [
          "La coma en FROM equivale a CROSS JOIN LATERAL para funciones de retorno de filas",
          "#>> con array de paths navega estructuras anidadas",
          "Siempre castear tipos: ::INT, ::NUMERIC, ::TIMESTAMPTZ",
          "jsonb_to_recordset es más seguro para tipos si conoces el schema",
        ],
      },
    ],
  },
  {
    id: 7,
    title: "Funciones & PL/pgSQL",
    icon: "⚙️",
    xp: 160,
    description: "Lógica de negocio en la base de datos",
    lessons: [
      {
        id: "7a",
        type: "concept",
        title: "PL/pgSQL: funciones, procedimientos y triggers",
        content: `**Tipos de rutinas:**
- **FUNCTION**: retorna un valor, puede usarse en SELECT
- **PROCEDURE**: sin retorno obligatorio, se llama con CALL, puede hacer COMMIT dentro
- **TRIGGER FUNCTION**: función especial llamada por triggers, retorna TRIGGER

**Estructura básica:**
\`\`\`sql
CREATE OR REPLACE FUNCTION mi_funcion(param1 INT, param2 TEXT DEFAULT 'default')
RETURNS TABLE(col1 INT, col2 TEXT)
LANGUAGE plpgsql
SECURITY DEFINER  -- ejecuta con permisos del creador
STABLE            -- no modifica datos, mismo input → mismo output
AS $$
DECLARE
  v_variable INT := 0;
  v_record RECORD;
BEGIN
  -- IF/ELSIF/ELSE
  IF param1 > 100 THEN
    v_variable := param1 * 2;
  ELSIF param1 > 50 THEN
    v_variable := param1 + 10;
  ELSE
    v_variable := 0;
  END IF;
  
  -- Loop con cursor
  FOR v_record IN SELECT id, nombre FROM tabla LOOP
    -- procesar v_record.id, v_record.nombre
    RETURN NEXT (v_record.id, v_record.nombre);
  END LOOP;
  
  -- Excepciones
  EXCEPTION 
    WHEN unique_violation THEN
      RAISE EXCEPTION 'Duplicado: %', SQLERRM;
    WHEN OTHERS THEN
      RAISE WARNING 'Error inesperado: %', SQLERRM;
      RETURN;
END;
$$;
\`\`\`

**Trigger de auditoría:**
\`\`\`sql
CREATE OR REPLACE FUNCTION fn_audit_trigger()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO audit_log(tabla, operacion, datos_antes, datos_despues, usuario, ts)
  VALUES (
    TG_TABLE_NAME,
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW) ELSE NULL END,
    current_user,
    NOW()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER audit_clientes
AFTER INSERT OR UPDATE OR DELETE ON clientes
FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();
\`\`\``,
      },
      {
        id: "7b",
        type: "challenge",
        title: "🔥 Desafío Final: Sistema de pricing dinámico",
        difficulty: "SEMI-SENIOR",
        scenario: `Diseña e implementa desde cero un sistema de precios dinámico.

**Tablas requeridas:**
- productos(id, nombre, precio_base, categoria_id)
- reglas_precio(id, tipo, condicion JSONB, descuento_pct, prioridad, activo)
- historial_precios(producto_id, precio_calculado, reglas_aplicadas JSONB, calculado_en)

**Tipos de reglas:**
- 'categoria': aplica a toda una categoría  
- 'volumen': descuento si qty > X
- 'cliente_vip': descuento para clientes marcados como VIP
- 'horario': descuento en horas específicas

**Función requerida:** \`calcular_precio(p_producto_id, p_qty, p_cliente_id)\`
- Debe aplicar todas las reglas activas que apliquen, en orden de prioridad
- Descuentos acumulables hasta un máximo de 40%
- Registrar en historial_precios
- Retornar precio final y desglose de reglas aplicadas`,
        hint: "Usa un cursor o FOR IN SELECT para iterar reglas ordenadas. Acumula descuentos. Usa JSONB para guardar el desglose.",
        solution: `-- ═══════════════════════════════════════
-- Schema
-- ═══════════════════════════════════════
CREATE TABLE reglas_precio (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(20) NOT NULL,
  condicion JSONB NOT NULL DEFAULT '{}',
  descuento_pct NUMERIC(5,2) NOT NULL,
  prioridad INT NOT NULL DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE historial_precios (
  id BIGSERIAL PRIMARY KEY,
  producto_id INT NOT NULL,
  cliente_id INT,
  qty INT NOT NULL,
  precio_base NUMERIC(10,2),
  precio_calculado NUMERIC(10,2),
  descuento_total_pct NUMERIC(5,2),
  reglas_aplicadas JSONB,
  calculado_en TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- Función principal
-- ═══════════════════════════════════════
CREATE OR REPLACE FUNCTION calcular_precio(
  p_producto_id INT,
  p_qty INT DEFAULT 1,
  p_cliente_id INT DEFAULT NULL
)
RETURNS TABLE(
  precio_final NUMERIC,
  precio_base NUMERIC,
  descuento_pct NUMERIC,
  reglas_aplicadas JSONB
)
LANGUAGE plpgsql AS $$
DECLARE
  v_precio_base NUMERIC;
  v_categoria_id INT;
  v_es_vip BOOLEAN := FALSE;
  v_hora_actual INT;
  v_descuento_acum NUMERIC := 0;
  v_max_descuento NUMERIC := 40;
  v_reglas_json JSONB := '[]'::JSONB;
  v_regla RECORD;
  v_aplica BOOLEAN;
  v_precio_final NUMERIC;
BEGIN
  -- Obtener datos del producto
  SELECT precio_base, categoria_id 
  INTO v_precio_base, v_categoria_id
  FROM productos WHERE id = p_producto_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Producto % no encontrado', p_producto_id;
  END IF;
  
  -- Verificar si cliente es VIP
  IF p_cliente_id IS NOT NULL THEN
    SELECT COALESCE((datos->>'vip')::BOOLEAN, FALSE)
    INTO v_es_vip
    FROM clientes WHERE id = p_cliente_id;
  END IF;
  
  v_hora_actual := EXTRACT(HOUR FROM NOW());
  
  -- Iterar reglas en orden de prioridad
  FOR v_regla IN
    SELECT id, tipo, condicion, descuento_pct
    FROM reglas_precio
    WHERE activo = TRUE
    ORDER BY prioridad DESC, id
  LOOP
    v_aplica := FALSE;
    
    CASE v_regla.tipo
      WHEN 'categoria' THEN
        v_aplica := (v_regla.condicion->>'categoria_id')::INT = v_categoria_id;
        
      WHEN 'volumen' THEN
        v_aplica := p_qty >= (v_regla.condicion->>'min_qty')::INT;
        
      WHEN 'cliente_vip' THEN
        v_aplica := v_es_vip;
        
      WHEN 'horario' THEN
        v_aplica := v_hora_actual BETWEEN 
          (v_regla.condicion->>'hora_inicio')::INT AND
          (v_regla.condicion->>'hora_fin')::INT;
        
      ELSE
        v_aplica := FALSE;
    END CASE;
    
    IF v_aplica THEN
      -- Acumular sin exceder el máximo
      v_descuento_acum := LEAST(
        v_descuento_acum + v_regla.descuento_pct,
        v_max_descuento
      );
      
      -- Agregar al desglose JSON
      v_reglas_json := v_reglas_json || jsonb_build_object(
        'regla_id', v_regla.id,
        'tipo', v_regla.tipo,
        'descuento_pct', v_regla.descuento_pct
      );
    END IF;
  END LOOP;
  
  -- Calcular precio final
  v_precio_final := ROUND(v_precio_base * (1 - v_descuento_acum / 100), 2);
  
  -- Registrar en historial
  INSERT INTO historial_precios(
    producto_id, cliente_id, qty, precio_base, 
    precio_calculado, descuento_total_pct, reglas_aplicadas
  ) VALUES (
    p_producto_id, p_cliente_id, p_qty, v_precio_base,
    v_precio_final, v_descuento_acum, v_reglas_json
  );
  
  RETURN QUERY SELECT v_precio_final, v_precio_base, v_descuento_acum, v_reglas_json;
END;
$$;

-- Uso:
SELECT * FROM calcular_precio(42, 10, 123);
-- Retorna: precio_final, precio_base, descuento_pct, reglas_aplicadas`,
        keyPoints: [
          "CASE ... WHEN en PL/pgSQL para dispatch por tipo de regla",
          "LEAST() para cap de descuento máximo de forma elegante",
          "jsonb_build_object y || para construir JSONB dinámicamente",
          "El patrón de 'motor de reglas' en DB es poderoso para lógica variable",
          "SECURITY DEFINER permite que la función corra con permisos del owner",
        ],
      },
    ],
  },
];

// ─── COMPONENTS ────────────────────────────────────────────────────────────────

const CodeBlock = ({ code }) => (
  <pre
    style={{
      background: THEME.code,
      border: `1px solid ${THEME.border}`,
      borderLeft: `3px solid ${THEME.accent}`,
      borderRadius: 6,
      padding: "14px 16px",
      overflowX: "auto",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: 12,
      lineHeight: 1.6,
      color: "#e6edf3",
      margin: "10px 0",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    }}
  >
    {code}
  </pre>
);

const renderContent = (text) => {
  if (!text) return null;
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith("```")) {
      const code = part.replace(/```(?:sql|json|javascript)?\n?/, "").replace(/```$/, "");
      return <CodeBlock key={i} code={code} />;
    }
    const lines = part.split("\n");
    return (
      <div key={i}>
        {lines.map((line, j) => {
          if (line.startsWith("**") && line.endsWith("**")) {
            return (
              <p key={j} style={{ color: THEME.accent, fontWeight: 700, marginTop: 12, marginBottom: 4 }}>
                {line.replace(/\*\*/g, "")}
              </p>
            );
          }
          if (line.startsWith("- ")) {
            return (
              <div key={j} style={{ display: "flex", gap: 8, marginBottom: 4, paddingLeft: 8 }}>
                <span style={{ color: THEME.green, flexShrink: 0 }}>▸</span>
                <span style={{ color: THEME.text, fontSize: 14 }}>{line.slice(2)}</span>
              </div>
            );
          }
          if (line.startsWith("*")) {
            return (
              <p key={j} style={{ color: THEME.text, fontSize: 14, lineHeight: 1.7, margin: "2px 0" }}>
                {line}
              </p>
            );
          }
          if (line.includes("|")) {
            return (
              <p key={j} style={{ fontFamily: "monospace", fontSize: 12, color: THEME.dim, margin: "1px 0" }}>
                {line}
              </p>
            );
          }
          return line ? (
            <p key={j} style={{ color: THEME.text, fontSize: 14, lineHeight: 1.7, marginBottom: 6 }}>
              {line.replace(/\*\*(.*?)\*\*/g, (_, m) => `[${m}]`).replace(/\`(.*?)\`/g, (_, m) => m)}
            </p>
          ) : (
            <br key={j} />
          );
        })}
      </div>
    );
  });
};

// ─── APP ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("home"); // home | module | lesson
  const [activeModule, setActiveModule] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showSolution, setShowSolution] = useState({});
  const [showHint, setShowHint] = useState({});
  const [xp, setXp] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState({});

  const totalXp = MODULES.reduce((s, m) => s + m.xp, 0);
  const level = xp < 200 ? "Aprendiz" : xp < 500 ? "Intermedio" : xp < 850 ? "Avanzado" : "Semi-Senior";
  const levelColor = xp < 200 ? THEME.yellow : xp < 500 ? THEME.orange : xp < 850 ? THEME.accent : THEME.green;

  const completeLesson = (lessonId, moduleXp) => {
    if (!completedLessons[lessonId]) {
      setCompletedLessons((p) => ({ ...p, [lessonId]: true }));
      setXp((p) => Math.min(p + Math.floor(moduleXp / 5), totalXp));
    }
  };

  const module = MODULES.find((m) => m.id === activeModule);
  const lesson = module?.lessons.find((l) => l.id === activeLesson);

  // HOME
  if (screen === "home") {
    return (
      <div style={{ minHeight: "100vh", background: THEME.bg, fontFamily: "'IBM Plex Mono', monospace", color: THEME.text }}>
        {/* Header */}
        <div style={{ borderBottom: `1px solid ${THEME.border}`, padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: THEME.accent, fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 4 }}>
              POSTGRESQL MASTERY PROGRAM
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: -1 }}>
              De Intermedio a <span style={{ color: THEME.green }}>Semi-Senior</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: THEME.dim, marginBottom: 4 }}>NIVEL ACTUAL</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: levelColor }}>{level}</div>
            <div style={{ fontSize: 12, color: THEME.dim }}>{xp} / {totalXp} XP</div>
          </div>
        </div>

        {/* XP Bar */}
        <div style={{ height: 3, background: THEME.border }}>
          <div style={{ height: "100%", width: `${(xp / totalXp) * 100}%`, background: `linear-gradient(90deg, ${THEME.accent}, ${THEME.green})`, transition: "width 0.5s" }} />
        </div>

        {/* Intro */}
        <div style={{ padding: "32px 32px 0" }}>
          <div style={{ background: THEME.panel, border: `1px solid ${THEME.border}`, borderRadius: 8, padding: 20, marginBottom: 28, maxWidth: 700 }}>
            <div style={{ color: THEME.accent, fontSize: 11, letterSpacing: 3, marginBottom: 10 }}>ACERCA DEL PROGRAMA</div>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: THEME.text, margin: 0 }}>
              Este programa asume que ya conoces SELECTs básicos, JOINs simples y operaciones CRUD. 
              Cada módulo contiene conceptos teóricos, ejercicios prácticos con soluciones comentadas, 
              y desafíos de dificultad creciente. El objetivo: dominar PostgreSQL a nivel 
              <span style={{ color: THEME.green, fontWeight: 700 }}> semi-senior</span> — 
              capaz de diseñar esquemas eficientes, optimizar queries complejos y escribir lógica robusta.
            </p>
          </div>

          {/* Progress bars */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
            {[
              { label: "Módulos", value: Object.keys(completedLessons).length, total: MODULES.reduce((s, m) => s + m.lessons.length, 0), color: THEME.accent },
              { label: "XP Ganado", value: xp, total: totalXp, color: THEME.green },
              { label: "Nivel", value: level, total: null, color: levelColor },
              { label: "Progreso", value: `${Math.round((xp / totalXp) * 100)}%`, total: null, color: THEME.yellow },
            ].map((stat, i) => (
              <div key={i} style={{ background: THEME.panel, border: `1px solid ${THEME.border}`, borderRadius: 6, padding: "14px 16px" }}>
                <div style={{ fontSize: 10, color: THEME.dim, letterSpacing: 2, marginBottom: 6 }}>{stat.label.toUpperCase()}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: stat.color }}>
                  {stat.value}{stat.total ? <span style={{ fontSize: 12, color: THEME.dim }}>/{stat.total}</span> : ""}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module Grid */}
        <div style={{ padding: "0 32px 40px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {MODULES.map((mod) => {
            const completedCount = mod.lessons.filter((l) => completedLessons[l.id]).length;
            const pct = (completedCount / mod.lessons.length) * 100;
            return (
              <div
                key={mod.id}
                onClick={() => { setActiveModule(mod.id); setScreen("module"); }}
                style={{
                  background: THEME.panel,
                  border: `1px solid ${pct === 100 ? THEME.green : THEME.border}`,
                  borderRadius: 8,
                  padding: 20,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = THEME.accent; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = pct === 100 ? THEME.green : THEME.border; e.currentTarget.style.transform = "none"; }}
              >
                {pct === 100 && (
                  <div style={{ position: "absolute", top: 12, right: 12, color: THEME.green, fontSize: 16 }}>✓</div>
                )}
                <div style={{ fontSize: 28, marginBottom: 10 }}>{mod.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{mod.title}</div>
                <div style={{ fontSize: 12, color: THEME.dim, marginBottom: 14, lineHeight: 1.5 }}>{mod.description}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 11, color: THEME.dim }}>{completedCount}/{mod.lessons.length} lecciones</div>
                  <div style={{ fontSize: 11, color: THEME.yellow }}>+{mod.xp} XP</div>
                </div>
                <div style={{ height: 3, background: THEME.border, borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? THEME.green : THEME.accent, borderRadius: 2, transition: "width 0.3s" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // MODULE VIEW
  if (screen === "module" && module) {
    return (
      <div style={{ minHeight: "100vh", background: THEME.bg, fontFamily: "'IBM Plex Mono', monospace", color: THEME.text }}>
        <div style={{ borderBottom: `1px solid ${THEME.border}`, padding: "16px 32px", display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => setScreen("home")}
            style={{ background: "none", border: `1px solid ${THEME.border}`, color: THEME.dim, padding: "6px 14px", borderRadius: 4, cursor: "pointer", fontSize: 12 }}
          >
            ← Volver
          </button>
          <span style={{ color: THEME.dim }}>|</span>
          <span style={{ fontSize: 20, }}>{module.icon}</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{module.title}</div>
            <div style={{ fontSize: 11, color: THEME.dim }}>{module.description}</div>
          </div>
        </div>

        <div style={{ padding: 32, maxWidth: 800 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {module.lessons.map((les, i) => {
              const done = completedLessons[les.id];
              const typeColors = { concept: THEME.accent, exercise: THEME.orange, quiz: THEME.yellow, challenge: THEME.red };
              const typeLabels = { concept: "CONCEPTO", exercise: "EJERCICIO", quiz: "QUIZ", challenge: "DESAFÍO" };
              return (
                <div
                  key={les.id}
                  onClick={() => { setActiveLesson(les.id); setScreen("lesson"); }}
                  style={{
                    background: THEME.panel,
                    border: `1px solid ${done ? THEME.green : THEME.border}`,
                    borderRadius: 8,
                    padding: "18px 20px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = typeColors[les.type]; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = done ? THEME.green : THEME.border; }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: done ? THEME.green + "20" : THEME.border, border: `2px solid ${done ? THEME.green : THEME.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: done ? THEME.green : THEME.dim, flexShrink: 0 }}>
                    {done ? "✓" : i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: typeColors[les.type], letterSpacing: 2, fontWeight: 700 }}>{typeLabels[les.type]}</span>
                      {les.difficulty && <span style={{ fontSize: 10, color: THEME.red, border: `1px solid ${THEME.red}`, padding: "1px 6px", borderRadius: 2 }}>{les.difficulty}</span>}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{les.title}</div>
                  </div>
                  <div style={{ fontSize: 18, color: THEME.dim }}>→</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // LESSON VIEW
  if (screen === "lesson" && lesson) {
    const markDone = () => completeLesson(lesson.id, module.xp);

    return (
      <div style={{ minHeight: "100vh", background: THEME.bg, fontFamily: "'IBM Plex Mono', monospace", color: THEME.text }}>
        <div style={{ borderBottom: `1px solid ${THEME.border}`, padding: "16px 32px", display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => setScreen("module")} style={{ background: "none", border: `1px solid ${THEME.border}`, color: THEME.dim, padding: "6px 14px", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>
            ← {module.title}
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{lesson.title}</div>
          </div>
          {completedLessons[lesson.id] && (
            <div style={{ color: THEME.green, fontSize: 12 }}>✓ COMPLETADO</div>
          )}
        </div>

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px 60px" }}>

          {/* CONCEPT */}
          {lesson.type === "concept" && (
            <div>
              <div style={{ background: THEME.panel, border: `1px solid ${THEME.border}`, borderRadius: 8, padding: 24 }}>
                {renderContent(lesson.content)}
              </div>
              <button
                onClick={markDone}
                style={{ marginTop: 20, background: THEME.accent, color: THEME.bg, border: "none", padding: "12px 28px", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "inherit" }}
              >
                Marcar como leído →
              </button>
            </div>
          )}

          {/* EXERCISE */}
          {(lesson.type === "exercise" || lesson.type === "challenge") && (
            <div>
              {lesson.difficulty && (
                <div style={{ display: "inline-block", border: `1px solid ${THEME.red}`, color: THEME.red, padding: "3px 12px", borderRadius: 3, fontSize: 11, letterSpacing: 2, marginBottom: 16 }}>
                  🔥 DESAFÍO {lesson.difficulty}
                </div>
              )}
              <div style={{ background: THEME.panel, border: `1px solid ${THEME.border}`, borderRadius: 8, padding: 24, marginBottom: 16 }}>
                <div style={{ color: THEME.accent, fontSize: 11, letterSpacing: 3, marginBottom: 12 }}>ENUNCIADO</div>
                {renderContent(lesson.scenario)}
              </div>

              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <button
                  onClick={() => setShowHint((p) => ({ ...p, [lesson.id]: !p[lesson.id] }))}
                  style={{ background: "none", border: `1px solid ${THEME.yellow}`, color: THEME.yellow, padding: "8px 18px", borderRadius: 5, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}
                >
                  {showHint[lesson.id] ? "Ocultar" : "Ver"} Pista 💡
                </button>
                <button
                  onClick={() => { setShowSolution((p) => ({ ...p, [lesson.id]: !p[lesson.id] })); markDone(); }}
                  style={{ background: "none", border: `1px solid ${THEME.green}`, color: THEME.green, padding: "8px 18px", borderRadius: 5, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}
                >
                  {showSolution[lesson.id] ? "Ocultar" : "Ver"} Solución ✓
                </button>
              </div>

              {showHint[lesson.id] && (
                <div style={{ background: "#1a1a00", border: `1px solid ${THEME.yellow}`, borderRadius: 6, padding: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: THEME.yellow, letterSpacing: 2, marginBottom: 8 }}>PISTA</div>
                  <p style={{ color: THEME.text, fontSize: 14, margin: 0 }}>{lesson.hint}</p>
                </div>
              )}

              {showSolution[lesson.id] && (
                <div>
                  <div style={{ background: THEME.panel, border: `1px solid ${THEME.green}`, borderRadius: 8, padding: 24, marginBottom: 16 }}>
                    <div style={{ color: THEME.green, fontSize: 11, letterSpacing: 3, marginBottom: 12 }}>SOLUCIÓN COMENTADA</div>
                    <CodeBlock code={lesson.solution} />
                  </div>
                  {lesson.keyPoints && (
                    <div style={{ background: THEME.panel, border: `1px solid ${THEME.border}`, borderRadius: 8, padding: 20 }}>
                      <div style={{ color: THEME.accent, fontSize: 11, letterSpacing: 3, marginBottom: 12 }}>PUNTOS CLAVE</div>
                      {lesson.keyPoints.map((kp, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                          <span style={{ color: THEME.accent, flexShrink: 0 }}>◆</span>
                          <span style={{ fontSize: 13, color: THEME.text }}>{kp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* QUIZ */}
          {lesson.type === "quiz" && (
            <div>
              {lesson.questions.map((q, qi) => {
                const selected = quizAnswers[`${lesson.id}-${qi}`];
                const submitted = quizSubmitted[`${lesson.id}-${qi}`];
                const isCorrect = selected === q.correct;
                return (
                  <div key={qi} style={{ background: THEME.panel, border: `1px solid ${THEME.border}`, borderRadius: 8, padding: 24, marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: THEME.dim, marginBottom: 8 }}>PREGUNTA {qi + 1}</div>
                    <pre style={{ fontSize: 14, color: "#fff", fontFamily: "inherit", whiteSpace: "pre-wrap", marginBottom: 16, lineHeight: 1.7 }}>{q.q}</pre>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                      {q.options.map((opt, oi) => {
                        let bg = "transparent";
                        let border = THEME.border;
                        let color = THEME.text;
                        if (submitted) {
                          if (oi === q.correct) { bg = THEME.green + "20"; border = THEME.green; color = THEME.green; }
                          else if (oi === selected && !isCorrect) { bg = THEME.red + "20"; border = THEME.red; color = THEME.red; }
                        } else if (oi === selected) {
                          border = THEME.accent; color = THEME.accent;
                        }
                        return (
                          <div
                            key={oi}
                            onClick={() => !submitted && setQuizAnswers((p) => ({ ...p, [`${lesson.id}-${qi}`]: oi }))}
                            style={{ border: `1px solid ${border}`, borderRadius: 5, padding: "10px 14px", cursor: submitted ? "default" : "pointer", background: bg, color, fontSize: 13, transition: "all 0.15s" }}
                          >
                            <span style={{ color: THEME.dim, marginRight: 10 }}>{String.fromCharCode(65 + oi)})</span>
                            {opt}
                          </div>
                        );
                      })}
                    </div>

                    {!submitted ? (
                      <button
                        disabled={selected === undefined}
                        onClick={() => {
                          setQuizSubmitted((p) => ({ ...p, [`${lesson.id}-${qi}`]: true }));
                          if (qi === lesson.questions.length - 1) markDone();
                        }}
                        style={{ background: selected !== undefined ? THEME.accent : THEME.border, color: THEME.bg, border: "none", padding: "8px 20px", borderRadius: 4, cursor: selected !== undefined ? "pointer" : "not-allowed", fontFamily: "inherit", fontSize: 12, fontWeight: 700 }}
                      >
                        Verificar
                      </button>
                    ) : (
                      <div style={{ border: `1px solid ${isCorrect ? THEME.green : THEME.red}`, borderRadius: 6, padding: 14, background: isCorrect ? THEME.green + "10" : THEME.red + "10" }}>
                        <div style={{ color: isCorrect ? THEME.green : THEME.red, fontWeight: 700, marginBottom: 6, fontSize: 13 }}>
                          {isCorrect ? "✓ CORRECTO" : "✗ INCORRECTO"}
                        </div>
                        <p style={{ color: THEME.text, fontSize: 13, margin: 0, lineHeight: 1.6 }}>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
