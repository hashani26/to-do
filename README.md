# Local Setup
1. `git clone https://github.com/hashani26/to-do.git` master branch
2. inside the to-do folder run the command `cd backend`
3. run commands `npm i`, `npm run build`, `npm run start`
4. open a separate terminal
5. run commands `cd frontend`, `npm i`, `npm run dev`
6. open a browser window and go to `http://localhost:5173/` to access the UI
7. recommended coding editor - VSCode

# Workspace Settings

Project specific settings are overriden in .vscode/settings.json. The configuration is set to enforce eslint and prettier recommended linting and code formatting on file save.

# UI Design

<img src="assets/to do UI design.png" width="500">

<br/>

# API Documentation

## [Postman Collection](https://documenter.getpostman.com/view/4964647/2sAYkHnHSY)
<br/>


# Frontend

### Tech Stack
ReactJs


    1. TypeScript

    Enable static type checking for maintain quality in development.

    2. Zustand

    Lightweight state management tool as the application is comparatively small and contains a few reusable sateful components.

fix linting using the command - `npm run lint -- --fix`

