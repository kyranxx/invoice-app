document.addEventListener('DOMContentLoaded', function() {
    console.log('Invoice app script.js loaded.');

    // Get DOM elements
    const invoiceForm = document.getElementById('invoice-form');
    const clientNameInput = document.getElementById('client-name');
    const clientAddressInput = document.getElementById('client-address');
    const designRadios = document.querySelectorAll('input[name="invoice_design"]');
    const previewArea = document.getElementById('invoice-preview');
    const generatePdfBtn = document.getElementById('generate-pdf-btn');

    // Store template HTML content
    const templates = {};

    // Function to fetch and store template HTML
    async function fetchTemplate(designValue) {
        if (!templates[designValue]) {
            try {
                // Use the new Flask endpoint for fetching raw templates
                const response = await fetch(`/get-template/${designValue}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                templates[designValue] = await response.text();
            } catch (error) {
                console.error(`Could not fetch template ${designValue}:`, error);
                templates[designValue] = `<p>Error loading template ${designValue}.</p>`; // Fallback
            }
        }
    }

    // Pre-fetch all templates
    async function prefetchTemplates() {
        const designPromises = [];
        designRadios.forEach(radio => {
            designPromises.push(fetchTemplate(radio.value));
        });
        await Promise.all(designPromises);
        updatePreview(); // Initial preview update after templates are loaded
    }


    // Function to update the live preview
    function updatePreview() {
        const clientName = clientNameInput.value || "[Client Name]";
        const clientAddress = clientAddressInput.value || "[Client Address]";
        const selectedDesign = document.querySelector('input[name="invoice_design"]:checked').value;

        console.log('Updating preview with:', { clientName, clientAddress, selectedDesign });

        if (templates[selectedDesign]) {
            let previewHtml = templates[selectedDesign];
            previewHtml = previewHtml.replace(/\[Client Name\]/g, clientName);
            previewHtml = previewHtml.replace(/\[Client Address\]/g, clientAddress);
            // Add more replacements for other fields as they are added to the form and templates

            previewArea.innerHTML = previewHtml;

            // Dynamically load CSS for the selected design
            // Remove previously loaded design CSS
            document.querySelectorAll('link[data-design-css]').forEach(link => link.remove());
            
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            // Extract number from selectedDesign (e.g., "design1" -> "1")
            const designNumber = selectedDesign.replace('design', ''); 
            cssLink.href = `/static/css/invoice_design_${designNumber}.css`; // Corrected path
            cssLink.setAttribute('data-design-css', 'true'); // Mark it for easy removal
            document.head.appendChild(cssLink);

        } else {
            previewArea.innerHTML = `<p>Loading template for ${selectedDesign}...</p>`;
            fetchTemplate(selectedDesign).then(() => updatePreview()); // Fetch if not available and retry
        }
    }

    // Event listeners
    if (invoiceForm) {
        invoiceForm.addEventListener('input', updatePreview); // Listen to any input change in the form
    }

    designRadios.forEach(radio => {
        radio.addEventListener('change', updatePreview);
    });

    if (generatePdfBtn) {
        generatePdfBtn.addEventListener('click', function() {
            // Logic to gather data and send to backend for PDF generation
            const formData = new FormData(invoiceForm);
            const selectedDesign = document.querySelector('input[name="invoice_design"]:checked').value;
            formData.append('selected_design', selectedDesign); // Add selected design to form data

            // Log data to be sent (for debugging)
            for (let [key, value] of formData.entries()) {
                console.log(`Form data for PDF: ${key}: ${value}`);
            }
            
            fetch('/generate-pdf', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // Check if the response is a PDF
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/pdf") !== -1) {
                    return response.blob();
                } else {
                    return response.text(); // Or response.json() if expecting JSON
                }
            })
            .then(data => {
                if (data instanceof Blob) {
                    // Create a link to download the PDF
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(data);
                    link.download = 'invoice.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    console.log('Server response (not PDF):', data);
                    alert('PDF generation initiated. Server response: ' + data);
                }
            })
            .catch(error => {
                console.error('Error generating PDF:', error);
                alert('Error generating PDF: ' + error.message);
            });
        });
    }

    // Initial call to prefetch templates and update preview
    prefetchTemplates();
});
