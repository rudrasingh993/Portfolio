# GEMINI.md

## Project Overview

This project is a personal portfolio website for a web developer named Rudra Pratap Singh. It is a static website built with HTML, CSS, and vanilla JavaScript. The design is a key feature, aiming for a modern, "museum-quality" aesthetic with light and dark themes, smooth animations, and a focus on typography.

The website is a single-page layout with the following sections:
- **Home:** A hero section with a typing animation and a call-to-action.
- **About:** A brief introduction and a list of skills.
- **Projects:** A gallery of projects with links to code and live demos.
- **Skills:** A more detailed breakdown of technical skills with progress bars.
- **Contact:** A contact form with validation.

The project does not use any front-end frameworks like React or Vue, or any build tools. It is a simple, classic web project.

## Building and Running

This is a static website with no build process. To run the project, you can simply open the `index.html` file in a web browser.

For development, it is recommended to use a local web server to avoid any issues with file paths or browser security restrictions. Many code editors have extensions that can provide this functionality, or you can use a simple command-line server.

The `package.json` file contains a single script:

```json
"scripts": {
  "update-sitemap": "node update-lastmod.js"
}
```

This script is used to update the `sitemap.xml` file. To run it, you will need to have Node.js installed. You can run the script with the following command:

```bash
npm run update-sitemap
```

## Development Conventions

### Styling

The project uses a single CSS file, `styles.css`, for all styling. It makes extensive use of CSS custom properties (variables) for theming and maintaining a consistent design. The color palette, fonts, and spacing are all defined as variables in the `:root` selector.

The styling is organized by section, with clear comments indicating the different parts of the website.

### JavaScript

The JavaScript code is located in `script.js`. It follows a modular pattern, with different functionalities encapsulated in separate functions. The main `DOMContentLoaded` event listener initializes all the different parts of the application.

The code is well-commented and easy to follow. It uses modern JavaScript features like `const` and `let`, arrow functions, and template literals.

### HTML

The `index.html` file is well-structured and uses semantic HTML5 tags. It includes a comprehensive set of meta tags for SEO and social media sharing. The sections of the website are clearly defined with `<section>` tags and appropriate IDs.
