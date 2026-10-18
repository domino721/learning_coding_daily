FROM node:24-bookworm-slim AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=secret,id=build_ca \
    if [ -f /run/secrets/build_ca ]; then export npm_config_cafile=/run/secrets/build_ca; fi; \
    npm ci
COPY src ./src
COPY public ./public
COPY index.html design.html tsconfig.json vite.config.ts ./
COPY tests/fixtures/learning-paths.json ./tests/fixtures/learning-paths.json
RUN npm run build:web

FROM ghcr.io/astral-sh/uv:0.12.23 AS uv
FROM python:3.12-slim-bookworm AS runtime
COPY --from=uv /uv /usr/local/bin/uv
WORKDIR /app
ENV PYTHONUNBUFFERED=1 \
    APP_SERVE_FRONTEND=1 \
    APP_REQUIRE_AUTH=1 \
    APP_DB_PATH=/app/.data/learning.sqlite3 \
    APP_TIMEZONE=Asia/Seoul
COPY pyproject.toml uv.lock ./
RUN --mount=type=secret,id=build_ca \
    if [ -f /run/secrets/build_ca ]; then export SSL_CERT_FILE=/run/secrets/build_ca UV_SYSTEM_CERTS=true; fi; \
    uv sync --frozen --no-dev --no-install-project
COPY backend ./backend
COPY --from=frontend /app/web-dist ./dist
RUN useradd --uid 10001 --create-home learner \
    && mkdir -p /app/.data \
    && chown -R learner:learner /app/.data /app/backend /app/dist
USER learner
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
    CMD ["/app/.venv/bin/python", "-c", "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/api/health', timeout=3)"]
CMD ["/app/.venv/bin/python", "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
