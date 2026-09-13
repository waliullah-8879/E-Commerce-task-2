# API reference

Base URL: `/api`. JSON request and response bodies. Auth uses `Authorization: Bearer <JWT>`.

| Route | Method | Auth | Request | Response |
|---|---|---|---|---|
| `/auth/register` | POST | Public | `{name,email,password}` | `{token,user}` |
| `/auth/login` | POST | Public | `{email,password}` | `{token,user}` |
| `/products` | GET | Public | `page,limit,category,minPrice,maxPrice,sort` query | `{products,pagination}` |
| `/products/:id` | GET | Public | none | product |
| `/products` | POST | Admin | product fields | created product |
| `/products/:id` | PUT | Admin | changed product fields | updated product |
| `/products/:id` | DELETE | Admin | none | `204 No Content` |
| `/orders` | GET | User/Admin | none | own orders, or all orders for admin |
| `/orders` | POST | User/Admin | `{shippingAddress,items:[{productId,qty}]}` | created order with DB prices and totals |
| `/orders/:id/status` | PATCH | Admin | `{status}` | updated order |

Checkout rejects missing/invalid quantities, missing products, and insufficient stock. Tax is calculated server-side at 8%; the client never submits prices or totals.
