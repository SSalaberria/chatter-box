# 📕 Chatterbox

<p align="center">
<img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" width="60" height="60" >
<img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width="60" height="60" >
<img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" width="60" height="60" >
</p>
<p align="center">
<img src="https://upload.wikimedia.org/wikipedia/commons/a/a8/NestJS.svg" width="60" height="60" >
<img src="https://icongr.am/devicon/mongodb-original.svg?size=128&color=currentColor" width="60" height="60" >
</p>

Chatterbox is yet another real time chatroom app.

Some of the techs used:
* Next.js as the frontend framework.
* TailwindCSS for the styling.
* NestJS for the backend, both for the services and the websocket.
* MongoDB for the database, with Mongoose as ODM.

# Running it locally

## Requirements

- [Node.js](https://nodejs.org/en) > 16.10.0
- [MongoDB Server](https://www.mongodb.com/try/download/community)


### Frontend
```cmd
npm install
npm run dev
```

### Backend
```cmd
npm install
npm run start:dev
```