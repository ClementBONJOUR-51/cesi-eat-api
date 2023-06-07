# CESI EATS BACKEND

## Lucnh

```bash
docker-compose up --build
```

## Setup micro-service exemple

{{Protocol}}//{{Host}}:{{Port}}/register

POST http://localhost:3000/register
body : 
{
    "url" : "http://server1:3000",
    "routes" : ["/login", "/token"]
}

POST http://localhost:3000/register
body : 
{
    "url" : "http://server2:3000",
    "routes" : ["/login", "/token"]
}