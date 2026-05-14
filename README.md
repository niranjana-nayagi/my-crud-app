## Security & RBAC Implementation

### Role-Based Access Control (RBAC)
Implemented a multi-user RBAC system with three roles:

- **Admin** → Full CRUD access + user management
- **Manager** → Create and update items
- **Viewer** → Read-only access

RBAC is enforced on both:
- **Frontend** using protected routes and conditional UI rendering
- **Backend** using JWT authentication middleware and role-based authorization middleware

Unauthorized users attempting restricted actions receive proper `403 Forbidden` responses.

---

## OWASP Security Practices Followed

This project follows OWASP secure coding practices including:

- Password hashing using `bcrypt`
- JWT-based secure authentication
- HTTP-only and SameSite cookies
- Rate limiting to prevent brute-force attacks
- Helmet.js security headers
- CORS protection
- NoSQL injection prevention
- Generic authentication error messages
- Least privilege access control
- Environment variable protection using `.env`

---

## Secure Authentication

- User passwords are securely hashed before storage
- JWT tokens are used for session management
- Tokens are stored in **HTTP-only cookies** to prevent XSS access
- Authentication middleware protects all sensitive routes
- Sessions persist securely without exposing credentials to the frontend

---

## Input Validation

Input validation is implemented on both frontend and backend.

Validation includes:
- Email format verification
- Password length enforcement
- Required field checks
- Role validation using allowed enums
- Request sanitization and trimming

Invalid requests return proper validation errors before reaching the database.

---

## Secure Handling of Sensitive Data

- Passwords are never stored in plain text
- Sensitive fields are excluded from API responses
- Environment variables are stored securely in `.env`
- `.env` is excluded from GitHub using `.gitignore`
- Database credentials and JWT secrets are never hardcoded
