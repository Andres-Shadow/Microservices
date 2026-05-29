FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o auth_server .

# ── Runtime image ──────────────────────────────────────────────
FROM alpine:3.19

WORKDIR /app

COPY --from=builder /app/auth_server .

EXPOSE 9090

CMD ["./auth_server"]
