# Copilot Instructions for proyecto-MalaMale

## Project Overview
This is a static website for a hair salon, primarily using HTML, CSS, and JavaScript. The project structure is flat, with separate HTML files for each page and dedicated folders for CSS, JS, and images. There is no build system or framework; all files are loaded directly by the browser.

## Key Directories and Files
- `index.html`, `servicios.html`, `productos.html`, etc.: Main site pages.
- `css/`: All custom and third-party CSS. Each page may have its own CSS file (e.g., `servicios.css`, `productos.css`).
- `js/`: All custom JavaScript for UI features (e.g., carousels, modals, navigation, shopping cart).
- `img/`: Images and some HTML/JS assets from external sources (e.g., Wix exports).

## Patterns and Conventions
- **No build step**: All code is written to run directly in the browser. Avoid Node.js, npm, or bundlers.
- **Page-specific assets**: Each HTML page may load its own CSS and JS files. Keep page logic isolated unless shared functionality is needed.
- **Vanilla JS**: No frameworks are used. Use plain JavaScript and DOM APIs.
- **Third-party code**: Some files in `img/` are minified or exported from Wix. Do not edit these directly.
- **Naming**: Use Spanish for file and variable names where possible, matching the existing codebase.

## Developer Workflows
- **Edit HTML/CSS/JS directly**: Open and modify files as needed. No compilation required.
- **Testing**: Open HTML files in a browser to test changes. There are no automated tests.
- **Debugging**: Use browser dev tools (F12) for debugging JS and inspecting styles.

## Integration Points
- **Wix/External assets**: Some pages reference scripts and assets from Wix or other external sources. Do not remove or break these links.
- **No backend**: All logic is client-side. There is no server or database integration.

## Examples
- To add a new service page, copy an existing HTML file, update content, and create matching CSS/JS if needed.
- To update the carousel, edit `js/carousel.js` and the relevant CSS/HTML.

## Do Not
- Do not introduce build tools, package managers, or frameworks.
- Do not edit minified or vendor files in `img/`.
- Do not add backend/server code.

---
For questions about project structure or conventions, review the main HTML files and the `css/` and `js/` folders for examples.
