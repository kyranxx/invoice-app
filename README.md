# InvoiceCraft - Professioneller Rechnungsgenerator

**Autor:** Daniel Blanárik

Eine Webanwendung, die es Benutzern ermöglicht, professionelle PDF-Rechnungen mit verschiedenen Vorlagen und Sprachoptionen (Deutsch/Englisch) zu erstellen. Erstellt mit Python und Flask, bietet sie eine Live-Vorschau und direkten PDF-Download.

**GitHub Repository:** [https://github.com/kyranxx/invoice-app](https://github.com/kyranxx/invoice-app)

## Hauptmerkmale

*   Erstellung von PDF-Rechnungen aus Webformular-Eingaben.
*   Mehrere Rechnungsvorlagen zur Auswahl (Modern, Klassisch, Elegant, Minimalistisch, Farbenfroh).
*   Unterstützung für Deutsch und Englisch mit UI-Übersetzung.
*   Live-Vorschau der generierten Rechnung direkt im Browser.
*   Direkter PDF-Download der fertigen Rechnung.
*   Automatische Berechnung von Zwischensummen, Mehrwertsteuer und Gesamtbeträgen.
*   Enthält einen Webhook für die automatisierte Bereitstellung über Git-Pushes (erfordert Serverkonfiguration).

## Verwendete Technologien

*   **Backend:** Python, Flask, WeasyPrint
*   **Frontend:** HTML, CSS, Vanilla JavaScript, Jinja2
*   **Bereitstellung:** Vercel (Beispiel), Git

## Einrichtung & Nutzung (Lokal)

1.  **Repository klonen:**
    ```bash
    git clone https://github.com/kyranxx/invoice-app.git
    cd invoice-app
    ```
2.  **Virtuelle Umgebung erstellen & aktivieren:**
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate
    ```
3.  **Abhängigkeiten installieren:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **(Optional) Webhook-Secret setzen:** Für die Webhook-Funktionalität setzen Sie die Umgebungsvariable `WEBHOOK_SECRET`.
5.  **Anwendung starten:**
    ```bash
    flask run
    ```
6.  Öffnen Sie Ihren Browser unter `http://127.0.0.1:5000` (oder der von Flask angegebenen Adresse).

---

# InvoiceCraft - Professional Invoice Generator

**Author:** Daniel Blanárik

A web application that allows users to create professional PDF invoices using various templates and language options (English/German). Built with Python and Flask, it features a live preview and direct PDF download.

**GitHub Repository:** [https://github.com/kyranxx/invoice-app](https://github.com/kyranxx/invoice-app)

## Key Features

*   Generate PDF invoices from web form input.
*   Multiple invoice design templates to choose from (Modern, Classic, Elegant, Minimalist, Colorful).
*   Support for English and German languages with UI translation.
*   Live preview of the generated invoice within the browser.
*   Direct PDF download of the finished invoice.
*   Automatic calculation of subtotals, VAT, and totals.
*   Includes a webhook for automated deployment via Git pushes (requires server setup).

## Technologies Used

*   **Backend:** Python, Flask, WeasyPrint
*   **Frontend:** HTML, CSS, Vanilla JavaScript, Jinja2
*   **Deployment:** Vercel (Example), Git

## Setup & Usage (Local)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/kyranxx/invoice-app.git
    cd invoice-app
    ```
2.  **Create & activate a virtual environment:**
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **(Optional) Set Webhook Secret:** For the webhook functionality, set the `WEBHOOK_SECRET` environment variable.
5.  **Run the application:**
    ```bash
    flask run
    ```
6.  Open your browser to `http://127.0.0.1:5000` (or the address provided by Flask).
