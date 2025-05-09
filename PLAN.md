# Invoice App Development Plan

## Progress Tracker

| Phase                      | Task                                     | Status      | Notes                                     |
| :------------------------- | :--------------------------------------- | :---------- | :---------------------------------------- |
| 1. Project Setup           | Initialize Flask App                     | Done        | `app.py` created                          |
|                            | Create Folder Structure                  | Done        | Created with initial files                |
| 2. Core HTML Structure     | Create `index.html` (main page)          | Done        | Basic structure created                   |
|                            | Create Invoice Template Snippets (x4)    | Done        | `invoice_template_1-4.html` created       |
| 3. Basic Styling           | Basic CSS for `index.html`               | Done        | `static/css/style.css` created            |
|                            | Placeholder CSS for Invoice Designs (x4) | Done        | `static/css/invoice_design_1-4.css` created |
| 4. Frontend Interactivity  | Basic `script.js` setup                  | Done        | `static/js/script.js` created             |
|                            | Form data reading                        | Done        | Basic implementation in `script.js`       |
|                            | Design selection logic                   | Done        | Basic implementation in `script.js`       |
|                            | Real-time preview update (basic)         | Done        | Basic implementation in `script.js`       |
| 5. Backend Logic (Flask)   | Serve `index.html`                       | Done        | `app.py` updated                          |
|                            | `/generate-pdf` route (placeholder)      | Done        | Implemented in `app.py`                   |
| 6. PDF Generation          | Integrate PDF library (e.g., WeasyPrint) | Done        | Integrated into `app.py` (user installs)  |
|                            | Implement PDF generation logic           | Done        | Implemented in `app.py`                   |
| 7. Advanced Styling        | Refine main page CSS                     | To Do       |                                           |
|                            | Implement 4 distinct invoice designs     | To Do       |                                           |
| 8. GitHub & Vercel       | Initialize Git & `.gitignore`            | To Do       |                                           |
|                            | Create `requirements.txt`                | To Do       |                                           |
|                            | Create `vercel.json`                     | To Do       |                                           |
|                            | Initial commit & push to GitHub          | To Do       |                                           |
|                            | Connect to Vercel & deploy             | To Do       |                                           |

## Phase Details

### Phase 1: Project Setup
*   **Task 1.1: Initialize Flask App**
    *   Create `app.py`.
    *   Install Flask: `pip install Flask`. (User should have done this)
    *   Basic Flask app structure in `app.py`.
*   **Task 1.2: Create Folder Structure**
    *   `invoice-app/` (main project folder, which is `c:/Users/blana/Desktop/invoice-app`)
        *   `app.py`
        *   `templates/`
        *   `static/`
            *   `css/`
            *   `js/`

### Phase 2: Core HTML Structure
*   **Task 2.1: Create `index.html`**
    *   Located in `templates/index.html`.
    *   Include:
        *   A form for invoice details (client name, address, items, prices, etc.).
        *   A section for design selection (e.g., radio buttons).
        *   A `<div>` to act as the real-time preview area.
        *   A "Generate PDF" button.
*   **Task 2.2: Create Invoice Template Snippets (x4)**
    *   Located in `templates/` (e.g., `invoice_template_1.html`, `invoice_template_2.html`, ...).
    *   These will be basic HTML structures for how an invoice looks, without specific styling yet. They will have placeholders for data.

### Phase 3: Basic Styling
*   **Task 3.1: Basic CSS for `index.html`**
    *   Create `static/css/style.css`.
    *   Link it in `index.html`.
    *   Add basic styles to make the form readable and the page layout functional.
*   **Task 3.2: Placeholder CSS for Invoice Designs (x4)**
    *   Create `static/css/invoice_design_1.css`, `invoice_design_2.css`, ...
    *   Link these (or a way to switch them) in relation to the invoice templates.
    *   Minimal styling for now, just to differentiate.

### Phase 4: Frontend Interactivity (JavaScript)
*   **Task 4.1: Basic `script.js` setup**
    *   Create `static/js/script.js`.
    *   Link it in `index.html`.
*   **Task 4.2: Form data reading**
    *   Write JS functions to get all values from the input fields.
*   **Task 4.3: Design selection logic**
    *   Write JS to detect which invoice design is selected.
*   **Task 4.4: Real-time preview update (basic)**
    *   When form data or design selection changes:
        *   Get the HTML content of the selected invoice template.
        *   Use JS to replace placeholders in the template with form data.
        *   Put the resulting HTML into the preview `<div>`.

### Phase 5: Backend Logic (Flask)
*   **Task 5.1: Serve `index.html`**
    *   In `app.py`, create a Flask route (e.g., `/`) that renders and returns `templates/index.html`.
*   **Task 5.2: `/generate-pdf` route (placeholder)**
    *   In `app.py`, create a Flask route (e.g., `/generate-pdf`) that will eventually handle PDF creation. For now, it can just return a simple message.

### Phase 6: PDF Generation
*   **Task 6.1: Integrate PDF library**
    *   Choose and install a PDF library (e.g., WeasyPrint: `pip install WeasyPrint`). (User should have done this)
    *   Add it to `requirements.txt`.
*   **Task 6.2: Implement PDF generation logic**
    *   In the `/generate-pdf` route:
        *   Receive invoice data and selected design from the frontend (likely via a POST request).
        *   Load the correct HTML invoice template.
        *   Populate it with the data.
        *   Use the PDF library to convert this HTML (with its specific CSS) to a PDF.
        *   Return the PDF to the user for download.

### Phase 7: Advanced Styling
*   **Task 7.1: Refine main page CSS**
    *   Improve the look and feel of `style.css` for the main form and page layout.
*   **Task 7.2: Implement 4 distinct invoice designs**
    *   Flesh out `invoice_design_1.css`, `invoice_design_2.css`, etc., to create visually appealing and distinct styles for the invoices.

### Phase 8: GitHub & Vercel Deployment
*   **Task 8.1: Initialize Git & `.gitignore`**
    *   Run `git init` in the project folder.
    *   Create a `.gitignore` file (e.g., for `__pycache__`, `.venv`).
*   **Task 8.2: Create `requirements.txt`**
    *   Run `pip freeze > requirements.txt` to list Python dependencies.
*   **Task 8.3: Create `vercel.json`**
    *   Create `vercel.json` to configure Vercel for a Python (Flask) app. Example:
      \`\`\`json
      {
        "version": 2,
        "builds": [
          {
            "src": "app.py",
            "use": "@vercel/python",
            "config": { "maxLambdaSize": "15mb", "runtime": "python3.9" }
          }
        ],
        "routes": [
          {
            "src": "/static/(.*)",
            "dest": "/static/$1"
          },
          {
            "src": "/(.*)",
            "dest": "app.py"
          }
        ]
      }
      \`\`\`
*   **Task 8.4: Initial commit & push to GitHub**
    *   `git add .`
    *   `git commit -m "Initial project setup"`
    *   Create a repository on GitHub.
    *   `git remote add origin <your-repo-url>`
    *   `git push -u origin main` (or `master`)
*   **Task 8.5: Connect to Vercel & deploy**
    *   Sign up/log in to Vercel.
    *   Import the GitHub repository.
    *   Vercel should detect the Flask setup (via `vercel.json` and `requirements.txt`) and deploy.
