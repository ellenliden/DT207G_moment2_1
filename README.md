# REST API för arbetserfarenheter

Detta repository innehåller ett REST API byggt med Node.js, Express och PostgreSQL. API:et hanterar arbetserfarenheter (work experience) och innehåller CRUD-funktionalitet (Create, Read, Update, Delete).

## Länk

Om du kör API:et lokalt är grundadressen:

```
jag ska lägga in länk här när jag publicerat på render.
```

## Installation och databas

1. Klona detta repository.
2. Kör npm install för att installera beroenden.
3. Skapa en PostgreSQL-databas och en tabell enligt nedan.
4. Lägg till en .env-fil med dina databasuppgifter:

   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=ditt_användarnamn
   DB_PASSWORD=ditt_lösenord
   DB_DATABASE=ditt_databasnamn
   ```

5. Starta servern med node server.js.

### Tabellstruktur

Tabellen "users" bör ha minst följande fält:

- id (serial, PK)
- companyname (varchar)
- jobtitle (varchar)
- location (varchar)
- startdate (date)
- enddate (date)
- description (text)

Exempel på SQL för att skapa tabellen:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  companyname VARCHAR(255) NOT NULL,
  jobtitle VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  startdate DATE NOT NULL,
  enddate DATE,
  description TEXT NOT NULL
);
```

## Användning

Nedan beskrivs hur du använder API:et för CRUD-operationer:

| Metod  | Ändpunkt       | Beskrivning                                |
| ------ | -------------- | ------------------------------------------ |
| GET    | /api/users     | Hämtar alla arbetserfarenheter             |
| GET    | /api/users/:id | Hämtar en specifik arbetserfarenhet        |
| POST   | /api/users     | Skapar en ny arbetserfarenhet (JSON-body)  |
| PUT    | /api/users/:id | Uppdaterar en arbetserfarenhet (JSON-body) |
| DELETE | /api/users/:id | Raderar en arbetserfarenhet                |

### Exempel på JSON-objekt

Så här ska ett objekt se ut när du skickar det till POST eller PUT:

```
{
  "companyname": "Mittuniversitetet",
  "jobtitle": "Universitetsadjunkt",
  "location": "Sundsvall",
  "startdate": "2019-01-01",
  "enddate": "2024-12-31",
  "description": "Programansvarig för Webbutvecklingsprogrammet."
}
```

## Felhantering

Om något fält saknas eller är felaktigt returnerar API:et ett tydligt felmeddelande i JSON-format.

## Kontakt

Ellen Lidén

Mejl: elli1807@student.miun.se
