# Food Recipe Project

A full-stack food recipe application with backend (Node.js/Express) and frontend (HTML/CSS/JS).

## Features
- Search recipes
- Download recipes as PDF
- Guest and signed-in user roles
- Secure authentication

## Folder Structure
- `FoodRecipeBackend/` → Backend server code (Node.js + Express)
- `FoodRecipeProjectFrontend/` → Client-side code

## Dependencies

### Main
- **bcrypt** `^6.0.0` — Password hashing
- **cookie-parser** `^1.4.7` — Parse cookies in requests
- **cors** `^2.8.5` — Enable CORS for API
- **dotenv** `^17.2.1` — Load environment variables
- **express** `^5.1.0` — Web framework for Node.js
- **jsonwebtoken** `^9.0.2` — JWT authentication
- **jspdf** `^3.0.1` — Generate PDFs in the frontend/backend
- **mongoose** `^8.17.0` — MongoDB ODM
- **pdfkit** `^0.17.1` — Create PDFs in Node.js

### Dev Dependencies
- **nodemon** `^3.1.10` — Auto-restart server during development

## Scripts

```bash
# To install all dependencies
npm install

# Start with nodemon (development)
npm run dev
