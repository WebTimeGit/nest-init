<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">A NestJS project template with TypeORM, JWT-based authentication, and email-based login.</p>
<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
</p>

## Description

This project is a backend application built using the [NestJS](https://nestjs.com/) framework. It includes pre-configured features like TypeORM for database management, JWT authentication, and email-based user login.

## Features

- **Database**: TypeORM integration for relational databases like PostgreSQL.
- **Authentication**: Secure JWT-based authentication.
- **Email-based Login**: Users can register and log in using their email address.
- **Scalable Architecture**: Organized controllers, services, and modules.
- **Tooling**: Includes ESLint, Prettier, Jest, and Husky for linting, formatting, testing, and pre-commit hooks.

## Installation

1. Clone the repository:
   git clone https://github.com/WebTimeGit/nest-init.git
   cd nest-init

2. Install dependencies:
   npm install

3. Set up the `.env` file in the root directory with the following variables:

    JWT_SECRET=your_jwt_secret
    ENCRYPTION_KEY=
    SESSION_SECRET=
    
    MONGODB_URI=mongodb://localhost:27017/simplApp
    POSTGRESQL_DB=your_db_name
    POSTGRESQL_HOST=localhost
    POSTGRESQL_PORT=5432
    POSTGRESQL_USER=your_db_user
    POSTGRESQL_PASS=your_db_password

   Replace `your_db_user`, `your_db_password`, `your_db_name`, and `your_jwt_secret` with actual values.

4. Run database migrations:
   npm run typeorm migration:run

## Running the app

Development:
   npm run start

Watch mode:
   npm run start:dev

Production:
   npm run start:prod

## Test

Unit tests:
   npm run test

E2E tests:
   npm run test:e2e

Test coverage:
   npm run test:cov

## API Overview

### Authentication

**Register**: POST /auth/register  
Payload:  
{  
  "email": "user@example.com",  
  "password": "yourpassword"  
}  

**Login**: POST /auth/login  
Payload:  
{  
  "email": "user@example.com",  
  "password": "yourpassword"  
}  
Response:  
{  
  "accessToken": "your_jwt_token"  
}

## License

This project is [UNLICENSED](LICENSE).
