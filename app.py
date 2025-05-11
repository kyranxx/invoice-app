import hashlib
import hmac
import os
import subprocess

from flask import Flask, jsonify, make_response, render_template, request
from weasyprint import CSS, HTML

app = Flask(__name__)

# Ensure the static folder is correctly configured for CSS
# if needed by WeasyPrint directly
app.static_folder = "static"

# Simple translation dictionary (can be expanded)
translations = {
    "en": {
        "invoice_title_pdf": "Invoice",
        "invoice_title_header": "INVOICE",
        "from_title_pdf": "FROM",
        "to_title_pdf": "TO",
        "company_name_pdf": "Company Name",
        "address_pdf": "Address",
        "tax_id_pdf": "Tax ID",
        "bank_details_pdf": "Bank Details",
        "vat_id_pdf": "VAT ID",
        "invoice_number_pdf": "Invoice Number",
        "invoice_date_pdf": "Invoice Date",
        "due_date_pdf": "Due Date",
        "delivery_date_pdf": "Delivery/Service Date",
        "description_pdf": "Description",
        "quantity_pdf": "Quantity",
        "unit_price_pdf": "Unit Price",
        "vat_rate_pdf": "VAT Rate",
        "total_pdf": "Total",
        "subtotal_pdf": "Subtotal",
        "total_vat_pdf": "Total VAT",
        "total_amount_pdf": "TOTAL AMOUNT",
        "payment_terms_pdf": "Payment Terms",
        "notes_pdf": "Notes",
    },
    "de": {
        "invoice_title_pdf": "Rechnung",
        "invoice_title_header": "RECHNUNG",
        "from_title_pdf": "VON",
        "to_title_pdf": "AN",
        "company_name_pdf": "Firmenname",
        "address_pdf": "Adresse",
        "tax_id_pdf": "Steuernummer",
        "bank_details_pdf": "Bankverbindung",
        "vat_id_pdf": "USt-IdNr.",
        "invoice_number_pdf": "Rechnungsnummer",
        "invoice_date_pdf": "Rechnungsdatum",
        "due_date_pdf": "Fälligkeitsdatum",
        "delivery_date_pdf": "Liefer-/Leistungsdatum",
        "description_pdf": "Beschreibung",
        "quantity_pdf": "Menge",
        "unit_price_pdf": "Einzelpreis",
        "vat_rate_pdf": "MwSt.-Satz",
        "total_pdf": "Gesamt",
        "subtotal_pdf": "Zwischensumme",
        "total_vat_pdf": "MwSt. Gesamt",
        "total_amount_pdf": "GESAMTBETRAG",
        "payment_terms_pdf": "Zahlungsbedingungen",
        "notes_pdf": "Anmerkungen",
    },
}


def _get_translation(key, lang_code="en"):
    # Fallback to English if lang_code not in translations
    # Fallback to key itself if key not in specific language or English
    return translations.get(lang_code, translations.get("en", {})).get(key, key)


@app.route("/")
def index():
    # Render the main page from templates/index.html
    return render_template("index.html")


# Route to serve raw HTML invoice templates for JS fetching
@app.route("/get-template/<design_id>")
def get_template(design_id):
    # design_id will be like "design1", "design2", etc.
    # We need to map this to the actual filename, e.g., "invoice_template_1.html"
    template_name = f"invoice_template_{design_id.replace('design', '')}.html"
    try:
        # Safely serve from the templates directory.
        # Note: For production, consider security implications of serving templates directly.
        # For this app's purpose (local preview), this is acceptable.
        # render_template is safer as it processes the template.
        # However, JS needs raw HTML.
        # A better approach might be to have JS fetch data and then JS renders the template,
        # or Flask renders the snippet to a string and returns it.
        # For simplicity now, we'll read the file content.
        template_path = os.path.join(app.root_path, "templates", template_name)
        with open(template_path, "r") as f:
            html_content = f.read()
        response = make_response(html_content)
        response.headers["Content-Type"] = "text/html"
        return response
    except FileNotFoundError:
        return make_response(f"Template {template_name} not found", 404)


@app.route("/generate-pdf", methods=["POST"])
def generate_pdf_route():
    try:
        data = request.form

        # Extract all form data
        template_data = {
            "supplier_name": data.get("supplier_name", "[Supplier Name]"),
            "supplier_address": data.get("supplier_address", "[Supplier Address]"),
            "supplier_tax_id": data.get("supplier_tax_id", "[Supplier Tax ID]"),
            "supplier_bank_details": data.get(
                "supplier_bank_details", "[Supplier Bank Details]"
            ),  # noqa: E501
            "client_name": data.get("client_name", "[Client Name]"),
            "client_address": data.get("client_address", "[Client Address]"),
            "client_vat_id": data.get("client_vat_id", "[Client VAT ID]"),
            "invoice_number": data.get("invoice_number", "[Invoice #]"),
            "invoice_date": data.get("invoice_date", "[Date]"),
            "due_date": data.get("due_date", "[Due Date]"),
            "delivery_date": data.get("delivery_date", ""),
            "payment_terms": (
                data.get("payment_terms", "")
                .replace("\r\n", "<br>")
                .replace("\n", "<br>")
            ),  # noqa: E501
            "notes": data.get("notes", "")
            .replace("\r\n", "<br>")
            .replace("\n", "<br>"),
        }

        # Process line items
        items = []
        item_descriptions = data.getlist("item_description[]")
        item_quantities = data.getlist("item_quantity[]")
        item_unit_prices = data.getlist("item_unit_price[]")
        item_vat_rates = data.getlist("item_vat_rate[]")

        subtotal = 0
        total_vat_amount = 0

        for i in range(len(item_descriptions)):
            quantity = float(item_quantities[i]) if item_quantities[i] else 0
            unit_price = float(item_unit_prices[i]) if item_unit_prices[i] else 0
            vat_rate = float(item_vat_rates[i]) if item_vat_rates[i] else 0

            line_total = quantity * unit_price
            vat_amount = line_total * (vat_rate / 100)

            items.append(
                {
                    "description": item_descriptions[i],
                    "quantity": quantity,
                    "unit_price": "%.2f" % unit_price,
                    "vat_rate": vat_rate,
                    "total": "%.2f" % line_total,
                    "vat_amount": "%.2f"
                    % vat_amount,  # For potential display in template
                }
            )
            subtotal += line_total
            total_vat_amount += vat_amount

        template_data["items"] = items
        template_data["subtotal"] = "%.2f" % subtotal
        template_data["total_vat"] = "%.2f" % total_vat_amount
        template_data["total_amount"] = "%.2f" % (
            subtotal + total_vat_amount
        )  # Changed key to total_amount

        selected_design_value = data.get("selected_design", "design1")  # e.g. "design1"
        lang = data.get("lang", "en")  # Get language, default to English

        # Add translation function and lang_code to template_data
        template_data["get_translation"] = _get_translation
        template_data["lang_code"] = lang
        template_data["currency_symbol"] = "€"  # Assuming Euro currency symbol

        template_number = selected_design_value.replace("design", "")  # "1", "2", etc.

        # Construct template name based on language
        if lang == "de":
            html_template_name = f"invoice_template_{template_number}_de.html"
        else:
            html_template_name = f"invoice_template_{template_number}.html"

        # Check if the language-specific template exists, fallback to English version if not
        template_path_check = os.path.join(
            app.root_path, "templates", html_template_name
        )  # noqa: E501
        if not os.path.exists(template_path_check):
            print(
                f"Warning: Template {html_template_name} not found. "
                "Falling back to English version."
            )
            html_template_name = f"invoice_template_{template_number}.html"

        css_file_name = f"invoice_design_{template_number}.css"

        # Render the HTML template with data
        # This fills in the placeholders in your invoice_template_X.html files
        # url_for is globally available in Jinja templates rendered by Flask
        html_string = render_template(html_template_name, **template_data)

        # Path to the specific CSS file for the selected design
        css_path = os.path.join(app.static_folder, "css", css_file_name)

        # Create WeasyPrint HTML object
        html = HTML(string=html_string, base_url=request.url_root)

        # Create WeasyPrint CSS object if the CSS file exists
        css_stylesheets = []
        if os.path.exists(css_path):
            css_stylesheets.append(CSS(filename=css_path))
        else:
            # Fallback or error if specific design CSS is missing
            print(f"Warning: CSS file not found at {css_path}")

        # Generate PDF
        pdf_bytes = html.write_pdf(stylesheets=css_stylesheets)

        # Send PDF as a response
        response = make_response(pdf_bytes)
        response.headers["Content-Type"] = "application/pdf"
        response.headers["Content-Disposition"] = "attachment; filename=invoice.pdf"
        return response

    except Exception as e:
        print(f"Error generating PDF: {e}")
        return make_response(f"Error generating PDF: {str(e)}", 500)


# Webhook secret key - SET THIS AS AN ENVIRONMENT VARIABLE ON PYTHONANYWHERE
# For local testing, you can set it directly:
# WEBHOOK_SECRET = "your_very_strong_and_secret_key"
WEBHOOK_SECRET = os.environ.get("WEBHOOK_SECRET")


def verify_signature(payload_body, secret_token, signature_header):  # noqa: E501
    """
    Verify that the payload was sent from GitHub by validating SHA256 signature.
    """
    if not signature_header:
        return False, "x-hub-signature-256 header is missing!"
    hash_object = hmac.new(
        secret_token.encode("utf-8"), msg=payload_body, digestmod=hashlib.sha256
    )
    expected_signature = "sha256=" + hash_object.hexdigest()
    if not hmac.compare_digest(expected_signature, signature_header):
        return False, "Request signatures didn't match!"
    return True, "Signatures match"


@app.route("/update-server", methods=["POST"])
def webhook():
    if not WEBHOOK_SECRET:
        return jsonify({"error": "Webhook secret not configured on server."}), 500

    signature = request.headers.get("X-Hub-Signature-256")
    is_valid, msg = verify_signature(request.data, WEBHOOK_SECRET, signature)

    if not is_valid:
        print(f"Webhook verification failed: {msg}")
        return jsonify({"error": "Invalid signature"}), 403

    if request.method == "POST":
        # You might want to check request.json for specific event types, e.g., 'push' to 'main' branch
        # For now, any valid POST from GitHub will trigger the script.
        print("Webhook received and verified. Attempting to run deployment script...")
        try:
            # Ensure deploy.sh is in the project root and executable
            # The path might need adjustment based on your PythonAnywhere setup
            # e.g., /home/YourUserName/YourProjectName/deploy.sh
            script_path = os.path.join(app.root_path, "deploy.sh")  # noqa: E501
            if not os.path.exists(script_path):
                print(f"Deployment script not found at {script_path}")
                return jsonify({"error": "Deployment script not found on server."}), 500

            # Make sure it's executable
            # os.chmod(script_path, 0o755) # Might not be needed if already set, or permission issues

            # Run the script
            process = subprocess.Popen(
                [script_path], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
            )
            stdout, stderr = process.communicate()

            if process.returncode == 0:
                print(f"Deployment script executed successfully:\n{stdout}")
                return (
                    jsonify(
                        {
                            "message": "Server update process started successfully.",
                            "output": stdout,
                        }
                    ),
                    200,
                )
            else:
                print(f"Deployment script failed with code {process.returncode}:")
                print(f"STDERR:\n{stderr}")
                print(f"STDOUT:\n{stdout}")
                return (
                    jsonify(
                        {
                            "error": "Deployment script failed.",
                            "details": stderr,
                            "stdout": stdout,
                        }
                    ),
                    500,
                )
        except Exception as e:
            print(f"Error running deployment script: {e}")
            return jsonify({"error": f"Error running deployment script: {str(e)}"}), 500
    else:
        return jsonify({"error": "Method not allowed"}), 405


if __name__ == "__main__":
    # For local testing of the webhook, you might need to use a tool like ngrok
    # And ensure WEBHOOK_SECRET is set in your local environment
    app.run(debug=True)
