# SecureAPI Gateway 🛡️

A production-ready, highly secure API Gateway built with **Node.js, Express, TypeScript, Redis, Nginx, and Docker**. 

This project is designed with an extreme focus on **Clean Architecture** and **Defensive Cybersecurity**. It includes a robust active defense mechanism (Honeypot/Tarpitting) to catch, slow down, and mislead automated scanners and malicious actors, all while keeping the actual infrastructure safe.

## 🚀 Features

- **Active Defense (Honeypot)**: Intercepts common reconnaissance paths (e.g., `/.env`, `/wp-admin`), wastes attacker time (tarpitting), and returns highly realistic fake payloads while logging their telemetry.
- **Strict Configuration Validation**: Uses `zod` to fail fast if the environment variables are not correctly set, ensuring no insecure defaults make it to production.
- **Distributed Rate Limiting**: Redis-backed rate limiting protects the gateway from brute force and DoS attacks across all instances.
- **Nginx First-Line Defense**: Nginx is configured to block known malicious user-agents (nmap, sqlmap, etc.), limit payload sizes to prevent buffer overflows, and hide server versions.
- **Container Security**: The Node.js application runs as a **non-root user** inside the Docker container to minimize the blast radius in case of RCE.
- **Multi-Layered Middleware Security**: 
  - Strict `Content-Type` enforcement.
  - Parameter Pollution mitigation.
  - Secure Headers via Helmet.
  - Strict CORS policy.
  - JWT Authentication for legitimate traffic.
- **Centralized Security Logging**: Winston logs standard traffic to `combined.log` but isolates critical security incidents and honeypot triggers to `security.log` for easy SIEM integration.

## 🏗️ Architecture

```
[Attacker/User] ---> [ Nginx (Reverse Proxy & Initial Filter) ]
                              |
                              v
                [ Node.js Express Gateway App ] ---> [ Redis (Rate Limits) ]
                    /                  \
                   /                    \
     [ Honeypot Middleware ]       [ JWT Validation ]
       (Fake Responses)                  \
                                          \
                                    [ Downstream Microservices ]
```

## 🛠️ Prerequisites

- Docker and Docker Compose

## ⚙️ Setup & Running

1. Clone the repository.
2. The environment variables template is provided in `.env.example`.
3. Build and run the stack using Docker Compose:

```bash
docker-compose up --build
```

### Testing the Honeypot 🪤

Try to act like a vulnerability scanner by accessing these paths on your local instance (`http://localhost`):

- `GET http://localhost/.env` (Returns fake AWS and DB credentials)
- `GET http://localhost/wp-admin` (Returns a fake WordPress login page)
- `GET http://localhost/admin` (Returns a fake list of super users)

While you do this, check the `logs/security.log` file in the container or mapped volume. You will see detailed telemetry of the "attack" being logged safely.

## 🔒 Security Posture for GitHub

- **Zero Secrets**: No hardcoded secrets exist in this repository. 
- **.gitignore**: `.env` and `logs/` are strictly ignored.
- **Configuration**: Use the `.env.example` to understand what variables are required to deploy this project securely.

## 📄 License

ISC License
