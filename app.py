from flask import Flask, render_template, request, make_response, send_from_directory
from weasyprint import HTML, CSS
import os

app = Flask(__name__)

# Ensure the static folder is correctly configured for CSS if needed by WeasyPrint directly
app.static_folder = 'static'

@app.route('/')
def index():
    # Render the main page from templates/index.html
    return render_template('index.html')

# Route to serve raw HTML invoice templates for JS fetching
@app.route('/get-template/<design_id>')
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
        template_path = os.path.join(app.root_path, 'templates', template_name)
        with open(template_path, 'r') as f:
            html_content = f.read()
        response = make_response(html_content)
        response.headers['Content-Type'] = 'text/html'
        return response
    except FileNotFoundError:
        return make_response(f"Template {template_name} not found", 404)


@app.route('/generate-pdf', methods=['POST'])
def generate_pdf_route():
    try:
        data = request.form
        client_name = data.get('client_name', 'N/A')
        client_address = data.get('client_address', 'N/A')
        selected_design_value = data.get('selected_design', 'design1') # e.g. "design1"
        
        # Map selected_design_value to template and CSS file names
        template_number = selected_design_value.replace('design', '') # "1", "2", etc.
        html_template_name = f'invoice_template_{template_number}.html'
        css_file_name = f'invoice_design_{template_number}.css' # Corrected: e.g. invoice_design_1.css

        # Data to pass to the template
        template_data = {
            'client_name': client_name,
            'client_address': client_address,
            # Add other form fields here as they are implemented
            # 'invoice_items': items_list,
            # 'total_amount': total
        }

        # Render the HTML template with data
        # This fills in the placeholders in your invoice_template_X.html files
        html_string = render_template(html_template_name, **template_data)

        # Path to the specific CSS file for the selected design
        css_path = os.path.join(app.static_folder, 'css', css_file_name)
        
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
        response.headers['Content-Type'] = 'application/pdf'
        response.headers['Content-Disposition'] = 'attachment; filename=invoice.pdf'
        return response

    except Exception as e:
        print(f"Error generating PDF: {e}")
        return make_response(f"Error generating PDF: {str(e)}", 500)

if __name__ == '__main__':
    app.run(debug=True)
