# NBA Analytics 2.0

Calendario, resultados, posiciones, jugadores y lesiones de la NBA con **Basketball-Reference como fuente principal**, auditoría de los datos y un modelo de pronóstico validado con backtesting.

**Principio:** todo lo que se muestra viene de Basketball-Reference o se calcula a partir de eso. No hay datos simulados: si algo falta, la app lo dice.

Sin dependencias y sin paso de compilación: es un sitio estático (HTML + JavaScript) y scripts de Node 20.

## Publicar en GitHub Pages

1. Sube este contenido a la rama `main`.
2. En **Settings → Pages → Build and deployment → Source** elige **GitHub Actions**.
3. En **Actions → Sitio (datos + despliegue) → Run workflow**. La primera vez baja las últimas 4 temporadas (~2 minutos por el límite de Sports Reference de 20 solicitudes/min).
4. Después se actualiza solo cada 6 horas.

Si Basketball-Reference bloquea los servidores de GitHub (error HTTP 403 en el paso de descarga), corre en tu computadora:

```bash
npm run fetch    # descarga a site/data
npm run model    # backtesting
git add site/data && git commit -m "datos" && git push
```

## Qué incluye

| Pestaña | Contenido |
|---|---|
| Calendario y resultados | Partidos por día o por equipo, con resultado, hora (ET), prórroga y pronóstico previo |
| Posiciones | Calculadas de los resultados y reconciliadas con las posiciones oficiales de BBR |
| Próximos y pronósticos | Probabilidad, margen, descanso (back-to-back) y lesiones como contexto |
| Jugadores | Promedios y métricas avanzadas de BBR (PER, TS%, BPM, VORP) |
| Lesiones | Reporte de BBR; se guarda una copia diaria en `site/data/injuries-history` |
| Auditoría | Revisión de partidos finalizados y próximos, y reconciliación con BBR |
| Modelo y backtesting | Pronósticos vs resultados reales de los últimos 7 a 60 días (acierto/fallo resaltado, margen previsto y real, fallos de alta confianza) y métricas fuera de muestra frente a pronósticos sin información |

## El modelo

Elo con ventaja de local, margen de victoria, descanso (back-to-back) y regresión entre temporadas. Cada pronóstico usa solo información anterior al partido. Los parámetros se ajustan con temporadas de **entrenamiento** y se miden en temporadas de **prueba** que no participan en el ajuste (hay una prueba automática que lo verifica). Un modelo solo vale si bate a la fila "tasa de local constante" de la pestaña Modelo.

### Puntos por equipo y total

Cada equipo recibe una media de la liga más su **ataque**, la **defensa** del rival, la ventaja de local y un ajuste por back-to-back; el ataque y la defensa se actualizan después de cada partido y regresan entre temporadas. Se ajusta y se mide con el mismo esquema (entrenamiento / prueba) y se compara contra “solo la media de la liga”. La pestaña Modelo muestra, por partido, los puntos previstos de cada equipo, el total previsto frente al real, su error, y el desempeño por equipo (error medio y sesgo).

Las lesiones **no** modifican el pronóstico: BBR solo publica el reporte vigente, no su historia, así que todavía no se puede demostrar con backtesting que ayuden. El proceso guarda un snapshot diario para poder hacerlo más adelante.

## Auditoría

`site/js/core/audit.js` revisa: 1230 partidos y 82 por equipo, 41 locales y 41 visitantes, duplicados, equipos con dos partidos el mismo día, marcadores válidos y atípicos, resultados con fecha futura, partidos pasados sin resultado, partidos pendientes con marcador, y compara los récords calculados con las posiciones oficiales de BBR. Los partidos de eliminación de la Copa NBA y el Play-In se excluyen de posiciones y modelo.

## Desarrollo

```bash
npm test         # pruebas (parsers, Elo sin mirar el futuro, backtest sin fuga, auditoría, pipeline completo)
npm run dev      # sitio en http://localhost:8080
```

Estructura: `scripts/` (descarga y modelo, Node) · `site/` (la app) · `site/js/core/` (motor compartido por Node y navegador) · `tests/`.

## Límites conocidos

- Los lectores de HTML se apoyan en los `data-stat` de BBR y, si no existen, en los encabezados de las tablas. Si BBR cambia su HTML, el paso de descarga falla de forma visible (aviso en la app) y se conservan los últimos datos válidos.
- No hay box scores por partido ni estadísticas por jugador histórico: ver el siguiente paso en "Roadmap".
- Respeta los términos de Sports Reference: 20 solicitudes/min, descarga con caché y sin reintentos agresivos.

## Roadmap

1. Box scores reales (`/boxscores/ID.html`) de los partidos nuevos, en incremental.
2. Validar con el historial de lesiones acumulado si un ajuste por lesiones mejora el modelo.
3. Comparar contra líneas de mercado si se incorpora una fuente.
