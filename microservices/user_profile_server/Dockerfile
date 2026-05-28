FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o user_profile_server .

# ── Runtime image ──────────────────────────────────────────────
FROM alpine:3.19

WORKDIR /app

COPY --from=builder /app/user_profile_server .

EXPOSE 9094

CMD ["./user_profile_server"]
