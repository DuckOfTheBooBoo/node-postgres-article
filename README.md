# Node PostgreSQL Article Manager

## Features
- Get an article.
- Add an article.
- Edit an article.
- Delete an article.

## Usage
### PostgreSQL Configuration
>You can either set an environment variable, or manually change the `config.js` values.

#### Environment Variables
- `DB_USER` : Database user
- `DB_PASS` : Password for DB_USER
- `DB_NAME` : Database ame
- `DB_TABLE_NAME` : Database table name (default "articles")
- `DB_HOST` : Host of the database (Could be IP Address or Domain name)

### Installing dependencies
```bash
npm i .
```

### Starting the server
> Make sure the database is running and able to accept connection.

To run the server:
```bash
npm run start
```

```bash
Hapi.js is running in http://0.0.0.0:8080
```

## API Specification
### GET
- Endpoint: /api/articles
- Query Parameters:
    - id: Id of the specific article (Int)
- Response: 
```JSON
{
    "status": "STRING", // success or fail
    "data": [] // Array of article
}
```
### POST
- Endpoint: /api/articles
- Body:
```JSON
{
    "title": "Title of the article",
    "content": "The content of the article"
}
```
- Response: 
```JSON
{
    "status": "STRING", // success or fail
    "message": "message of the response"
}
```
### PUT
- Endpoint: /api/articles
- Query Parameters: 
    > Provide only one of them.
    - id: Id of the article (Int)
    - uid: Unique id of the article (String)
- Body:
```JSON
{
    "title": "Title of the article",
    "content": "The content of the article"
}
```
- Response: 
```JSON
{
    "status": "STRING", // success or fail
    "message": "message of the response"
}
```
### DELETE
- Endpoint: /api/articles
- Query Parameters: 
    - id: Id of the article (Int)
- Response: 
```JSON
{
    "status": "STRING", // success or fail
    "message": "message of the response"
}
```