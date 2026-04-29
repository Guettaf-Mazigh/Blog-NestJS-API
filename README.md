<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# BlogApiNest

A NestJS REST API for managing blog articles.

This repository currently focuses on the `feature/articles` branch work, where the Articles module was built end to end with TypeORM, validation, and tests.

## What Was Built

### Articles Feature

- `POST /articles` to create an article
- `GET /articles` to list all articles
- `GET /articles/:id` to retrieve one article
- `PATCH /articles/:id` to update an article
- `DELETE /articles/:id` to remove an article

### Data Layer

- `Article` entity mapped with TypeORM
- MySQL integration through `TypeOrmModule`
- Repository injection with `@InjectRepository(Article)`
- Environment-based database configuration through `@nestjs/config`

### Validation

- Global `ValidationPipe` enabled in `main.ts`
- DTO validation with `class-validator` and `class-transformer`
- Article rules:
  - `title`: required, string, 3 to 255 characters
  - `content`: required, string, 10 to 5000 characters

### Error Handling

- `update` throws `NotFoundException` when the article does not exist
- `remove` throws `NotFoundException` when the article does not exist

### Testing

- Unit tests for `ArticlesService`
- Unit tests for `ArticlesController`
- E2E tests for the Articles API using SQLite in memory

## Tech Stack

- NestJS 11
- TypeScript
- TypeORM
- MySQL for the application database
- SQLite for e2e tests
- Jest
- Supertest
- class-validator
- class-transformer

## Project Setup

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=blog_api
PORT=3000
```

## Run the App

```bash
# development
npm run start:dev

# production
npm run build
npm run start:prod
```

## Run Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# coverage
npm run test:cov
```

## Useful Targeted Test Commands

```bash
npx jest src/articles/articles.service.spec.ts --runInBand
npx jest src/articles/articles.controller.spec.ts --runInBand
npx jest test/articles.e2e-spec.ts --config ./test/jest-e2e.json --runInBand
```

## API Examples

```bash
# Create an article
curl -X POST http://localhost:3000/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"My first article","content":"This is a valid article content."}'

# Get all articles
curl http://localhost:3000/articles

# Get one article
curl http://localhost:3000/articles/1

# Update an article
curl -X PATCH http://localhost:3000/articles/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated title"}'

# Delete an article
curl -X DELETE http://localhost:3000/articles/1
```

## Notes

- The application uses MySQL at runtime.
- E2E tests run against an in-memory SQLite database.
- The README intentionally keeps the default NestJS logo at the top.
