# Cloud E-Commerce Sample

A full-stack e-commerce reference application on AWS using TypeScript.

## Architecture

```
Browser → CloudFront → S3 (React SPA)
                ↓
         API Gateway (REST)
                ↓
         Lambda Functions (TypeScript)
         ├── Cognito Authorizer (JWT)
         └── DynamoDB (single-table)
```

**AWS Services:** Cognito · API Gateway · Lambda · DynamoDB · S3 · CloudFront
**IaC:** Serverless Framework v3
**Frontend:** React 18 · Vite · Tailwind CSS · AWS Amplify JS · React Query

---

## Project Structure

```
cloud-ecommerce-sample/
├── backend/
│   ├── serverless.yml          # All infra (DynamoDB, Cognito, Lambda, API GW)
│   ├── src/
│   │   ├── handlers/           # products.ts · cart.ts · orders.ts
│   │   ├── lib/                # dynamo.ts · response.ts
│   │   └── models/             # product.ts · cart.ts · order.ts
└── frontend/
    ├── src/
    │   ├── pages/              # ProductsPage · CartPage · OrdersPage · Login · Register
    │   ├── components/         # Navbar · ProductCard · ProtectedRoute
    │   └── services/           # api.ts · auth.ts
    └── .env.example
```

---

## Prerequisites

- Node.js 20+
- AWS CLI configured (`aws configure`)
- Serverless Framework: `npm install -g serverless`

---

## Getting Started

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Run backend locally

Requires [serverless-dynamodb-local](https://github.com/99x/serverless-dynamodb-local) for a local DynamoDB, or point at a real AWS account.

```bash
npm run offline
# API runs on http://localhost:3001
```

### 3. Deploy backend to AWS

```bash
npm run deploy
# or: serverless deploy --stage prod
```

After deploy, note the **Outputs** section — copy:
- `ApiUrl`
- `UserPoolId`
- `UserPoolClientId`

### 4. Configure frontend

```bash
cd ../frontend
cp .env.example .env.local
# Fill in VITE_API_URL, VITE_COGNITO_USER_POOL_ID, VITE_COGNITO_CLIENT_ID
```

### 5. Run frontend locally

```bash
npm install
npm run dev
# App runs on http://localhost:3000
```

### 6. Build frontend for production

```bash
npm run build
# Output in dist/ — upload to S3 and serve via CloudFront
```

---

## API Reference

| Method | Path                    | Auth     | Description           |
|--------|-------------------------|----------|-----------------------|
| GET    | /products               | Public   | List products         |
| GET    | /products/{id}          | Public   | Get product           |
| POST   | /products               | Cognito  | Create product        |
| PUT    | /products/{id}          | Cognito  | Update product        |
| DELETE | /products/{id}          | Cognito  | Delete product        |
| GET    | /cart                   | Cognito  | Get cart              |
| POST   | /cart/items             | Cognito  | Add item to cart      |
| PUT    | /cart/items/{productId} | Cognito  | Update item quantity  |
| DELETE | /cart/items/{productId} | Cognito  | Remove item           |
| POST   | /orders                 | Cognito  | Create order (checkout)|
| GET    | /orders                 | Cognito  | List orders           |
| GET    | /orders/{id}            | Cognito  | Get order             |

---

## DynamoDB Single-Table Design

| Entity    | PK                 | SK                 |
|-----------|--------------------|--------------------|
| Product   | `PRODUCT#<id>`     | `PRODUCT#<id>`     |
| Cart item | `CART#<userId>`    | `ITEM#<productId>` |
| Order     | `ORDER#<orderId>`  | `ORDER#<orderId>`  |

GSI `UserOrdersIndex`: `gsi1pk = USER#<userId>` / `gsi1sk = ORDER#<orderId>`
GSI `EntityTypeIndex`: `entityType = PRODUCT` — for listing all products

---

## Tear Down

```bash
cd backend
serverless remove
```
