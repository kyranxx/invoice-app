document.addEventListener('DOMContentLoaded', function() {
    console.log('Invoice app script.js loaded.');

    // Get DOM elements
    const invoiceForm = document.getElementById('invoice-form');
    const designRadios = document.querySelectorAll('input[name="invoice_design"]');
    const previewContainer = document.getElementById('invoice-preview-container');
    const previewInvoiceBtn = document.getElementById('preview-invoice-btn'); // "Show Preview"
    const generatePdfBtn = document.getElementById('generate-pdf-btn'); // "Download PDF"
    const addItemBtn = document.getElementById('add-item-btn'); // Now a text button
    const lineItemsContainer = document.getElementById('line-items-container');
    const langEnBtn = document.getElementById('lang-en');
    const langDeBtn = document.getElementById('lang-de');

    // --- I18n Translations ---
    const translations = {
        en: {
            app_title: "InvoiceCraft - Professional Invoice Generator",
            github_link_text_header: "View on GitHub", // For header link
            footer_copyright: "&copy; 2025 Daniel Blanárik. All rights reserved.", // For footer
            footer_copyright_header: "2025 Daniel Blanárik | <a href=\"https://github.com/kyranxx/invoice-app\" target=\"_blank\" rel=\"noopener noreferrer\">View on GitHub</a>", // Updated for header
            create_invoice_title: "<span>Create Your Invoice</span>",
            your_details_legend: "<span>Your Details</span>",
            client_details_legend: "<span>Client Details</span>",
            invoice_particulars_legend: "<span>Invoice Particulars</span>",
            items_services_legend: "<span>Items & Services</span>",
            payment_notes_legend: "<span>Payment & Notes</span>",
            supplier_name_label: "Company Name:",
            supplier_address_label: "Address:",
            supplier_tax_id_label: "Tax ID (Steuernummer/USt-IdNr.):",
            supplier_bank_details_label: "Bank Details (IBAN, BIC):",
            client_name_label: "Company Name:",
            client_address_label: "Address:",
            client_vat_id_label: "VAT ID (USt-IdNr.):",
            invoice_number_label: "Invoice Number:",
            invoice_date_label: "Invoice Date:",
            due_date_label: "Due Date:",
            delivery_date_label: "Delivery/Service Date:",
            item_description_placeholder: "Service or Product Description",
            payment_terms_label: "Payment Terms:",
            payment_terms_placeholder: "e.g., Payment due within 14 days",
            notes_label: "Notes:",
            notes_placeholder: "e.g., Thank you for your business!",
            add_item_btn_text: "Add Item", // For the text button
            remove_item_title: "Remove item", // For the X icon title
            show_preview_btn: "Show Preview",
            download_pdf_btn_text: "Download PDF", // For span inside button
            choose_style_title: "<span>Choose Your Style</span>",
            style_modern: "Modern",
            style_classic: "Classic",
            style_elegant: "Elegant",
            style_minimalist: "Minimalist",
            style_colorful: "Colorful",
            preview_title: "<span>Preview</span>",
            preview_placeholder: 'Your crafted invoice will appear here once you click "Show Preview".',
            loading_preview: 'Loading preview...',
            alert_at_least_one_item: "You must have at least one line item.",
        },
        de: {
            app_title: "InvoiceCraft - Professioneller Rechnungsgenerator",
            github_link_text_header: "Auf GitHub ansehen",
            footer_copyright: "&copy; 2025 Daniel Blanárik. Alle Rechte vorbehalten.",
            footer_copyright_header: "2025 Daniel Blanárik | <a href=\"https://github.com/kyranxx/invoice-app\" target=\"_blank\" rel=\"noopener noreferrer\">Auf GitHub ansehen</a>", // Updated for header
            create_invoice_title: "<span>Rechnung Erstellen</span>",
            your_details_legend: "<span>Ihre Angaben</span>",
            client_details_legend: "<span>Kundenangaben</span>",
            invoice_particulars_legend: "<span>Rechnungsdetails</span>",
            items_services_legend: "<span>Artikel & Dienstleistungen</span>",
            payment_notes_legend: "<span>Zahlung & Notizen</span>",
            supplier_name_label: "Firmenname:",
            supplier_address_label: "Adresse:",
            supplier_tax_id_label: "Steuernummer/USt-IdNr.:",
            supplier_bank_details_label: "Bankverbindung (IBAN, BIC):",
            client_name_label: "Firmenname:",
            client_address_label: "Adresse:",
            client_vat_id_label: "USt-IdNr.:",
            invoice_number_label: "Rechnungsnummer:",
            invoice_date_label: "Rechnungsdatum:",
            due_date_label: "Fälligkeitsdatum:",
            delivery_date_label: "Liefer-/Leistungsdatum:",
            item_description_placeholder: "Dienstleistung oder Produktbeschreibung",
            payment_terms_label: "Zahlungsbedingungen:",
            payment_terms_placeholder: "z.B. Zahlbar innerhalb von 14 Tagen",
            notes_label: "Anmerkungen:",
            notes_placeholder: "z.B. Vielen Dank für Ihren Auftrag!",
            add_item_btn_text: "Position Hinzufügen",
            remove_item_title: "Position entfernen",
            show_preview_btn: "Vorschau Anzeigen",
            download_pdf_btn_text: "PDF Herunterladen",
            choose_style_title: "<span>Wählen Sie Ihren Stil</span>",
            style_modern: "Modern",
            style_classic: "Klassisch",
            style_elegant: "Elegant",
            style_minimalist: "Minimalistisch",
            style_colorful: "Farbenfroh",
            preview_title: "<span>Vorschau</span>",
            preview_placeholder: 'Ihre erstellte Rechnung wird hier angezeigt, nachdem Sie auf "Vorschau Anzeigen" geklickt haben.',
            loading_preview: 'Vorschau wird geladen...',
            alert_at_least_one_item: "Sie müssen mindestens eine Position haben.",
        }
    };

    let currentLanguage = localStorage.getItem('invoiceLang') || 'de'; // Default to German

    function applyTranslations(lang) {
        document.querySelectorAll('[data-translate-key]').forEach(el => {
            const key = el.dataset.translateKey;
            const translation = translations[lang]?.[key];
            if (translation) {
                if (el.hasAttribute('data-translate-placeholder-key')) { // Specifically for placeholders
                    el.placeholder = translation;
                } else if (el.hasAttribute('data-translate-title-key')) { // Specifically for titles
                    el.title = translation;
                }
                 else {
                    el.innerHTML = translation; // For general text content, including spans inside buttons/labels
                }
            }
        });
        // Update document title
        document.title = translations[lang]?.app_title || "InvoiceCraft";
        // Update static labels that are not wrapped in spans with data-translate-key
        const labelTranslations = {
            "supplier_name_label": "supplier-name", "supplier_address_label": "supplier-address",
            "supplier_tax_id_label": "supplier-tax-id", "supplier_bank_details_label": "supplier-bank-details",
            "client_name_label": "client-name", "client_address_label": "client-address",
            "client_vat_id_label": "client-vat-id", "invoice_number_label": "invoice-number",
            "invoice_date_label": "invoice-date", "due_date_label": "due-date",
            "delivery_date_label": "delivery-date", "payment_terms_label": "payment-terms",
            "notes_label": "notes"
        };
        for(const key in labelTranslations){
            const labelText = translations[lang]?.[key];
            const labelElement = document.querySelector(`label[for="${labelTranslations[key]}"]`);
            if(labelElement && labelText){
                // Assuming the structure is <label for="id">TEXT</label>
                // Or <label for="id">TEXT <input></label> - preserve input
                let inputChild = null;
                if(labelElement.children.length > 0 && labelElement.children[0].tagName === 'INPUT'){
                    inputChild = labelElement.children[0];
                }
                labelElement.textContent = labelText;
                if(inputChild) labelElement.appendChild(inputChild);
            }
        }
    }

    function setLanguage(lang) {
        currentLanguage = lang;
        localStorage.setItem('invoiceLang', lang);
        applyTranslations(lang);
        if(langEnBtn) langEnBtn.classList.toggle('active', lang === 'en');
        if(langDeBtn) langDeBtn.classList.toggle('active', lang === 'de');
        document.documentElement.lang = lang;
    }

    if (langEnBtn) langEnBtn.addEventListener('click', () => setLanguage('en'));
    if (langDeBtn) langDeBtn.addEventListener('click', () => setLanguage('de'));

    function setPdfButtonState(enabled) {
        if (generatePdfBtn) {
            if (enabled) {
                generatePdfBtn.classList.remove('disabled');
                generatePdfBtn.disabled = false;
            } else {
                generatePdfBtn.classList.add('disabled');
                generatePdfBtn.disabled = true;
            }
        }
    }
    setPdfButtonState(false); // Initially disabled

    async function updatePreview() {
        const formData = new FormData(invoiceForm);
        const selectedDesignValue = document.querySelector('input[name="invoice_design"]:checked').value;
        formData.append('selected_design', selectedDesignValue);
        formData.append('lang', currentLanguage); // Send language to backend

        const loadingMessageKey = "loading_preview";
        previewContainer.innerHTML = `<p class="placeholder-text" data-translate-key="${loadingMessageKey}">${translations[currentLanguage]?.[loadingMessageKey] || 'Loading preview...'}</p>`;
        setPdfButtonState(false);

        try {
            const response = await fetch('/generate-pdf', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`PDF generation failed: ${response.status} ${errorText}`);
            }

            const pdfBlob = await response.blob();
            if (pdfBlob.type !== 'application/pdf') {
                throw new Error('Server did not return a PDF file.');
            }

            const pdfUrl = URL.createObjectURL(pdfBlob);
            previewContainer.innerHTML = `<embed src="${pdfUrl}" type="application/pdf" width="100%" height="100%" />`;
            setPdfButtonState(true);

        } catch (error) {
            console.error('Error updating preview:', error);
            previewContainer.innerHTML = `<p class="placeholder-text error-text">Error loading preview: ${error.message}</p>`;
            setPdfButtonState(false);
        }
    }

    if (previewInvoiceBtn) {
        previewInvoiceBtn.addEventListener('click', () => {
            updatePreview().catch(err => {
                console.error("Error during preview generation:", err);
                previewContainer.innerHTML = `<p class="placeholder-text error-text">Failed to generate preview: ${err.message}</p>`;
                setPdfButtonState(false);
            });
        });
    }

    designRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const clientNameInput = invoiceForm.elements['client_name'];
            const clientName = clientNameInput ? clientNameInput.value : '';
            const isPreviewContentPresent = previewContainer.querySelector('embed') ||
                                           (previewContainer.querySelector('.error-text'));

            if (isPreviewContentPresent || (clientName && clientName.trim() !== '')) {
                 updatePreview().catch(err => {
                    console.error("Error during preview generation on design change:", err);
                    previewContainer.innerHTML = `<p class="placeholder-text error-text">Failed to generate preview: ${err.message}</p>`;
                    setPdfButtonState(false);
                });
            }
        });
    });

    function createLineItemHTML() {
        const descPlaceholder = translations[currentLanguage]?.item_description_placeholder || "Service or Product Description";
        const removeTitle = translations[currentLanguage]?.remove_item_title || "Remove item";
        // For dynamically added rows, we don't use labels, just direct inputs like the first row.
        return `
            <input type="text" name="item_description[]" placeholder="${descPlaceholder}" required class="item-input-description" data-translate-placeholder-key="item_description_placeholder">
            <input type="number" name="item_quantity[]" value="1" min="0" step="any" required class="item-input-small" title="Quantity">
            <input type="number" name="item_unit_price[]" value="0.00" min="0" step="0.01" required class="item-input-medium" title="Unit Price (€)">
            <input type="number" name="item_vat_rate[]" value="19" min="0" step="1" required class="item-input-small" title="VAT Rate (%)">
            <button type="button" class="remove-item-btn icon-btn" title="${removeTitle}" data-translate-title-key="remove_item_title">&times;</button>
        `;
    }

    if (addItemBtn) {
        addItemBtn.addEventListener('click', function() {
            const newItemDiv = document.createElement('div');
            newItemDiv.classList.add('line-item');
            // For subsequent rows, use the same direct input structure as the first row.
            // The CSS for `.line-item:not(:first-child)` will apply if needed, but the HTML structure is the same.
            newItemDiv.innerHTML = createLineItemHTML();

            // Translate placeholder for the new description input
            const newDescInput = newItemDiv.querySelector('input[name="item_description[]"]');
            if (newDescInput) {
                newDescInput.placeholder = translations[currentLanguage]?.item_description_placeholder || "Service or Product Description";
            }
            const newRemoveBtn = newItemDiv.querySelector('.remove-item-btn');
            if(newRemoveBtn) {
                newRemoveBtn.title = translations[currentLanguage]?.remove_item_title || "Remove item";
            }

            lineItemsContainer.appendChild(newItemDiv);
            newRemoveBtn.addEventListener('click', function() {
                this.closest('.line-item').remove();
            });
        });
    }

    // Attach listener to initially present remove buttons
    lineItemsContainer.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', function() {
            if (lineItemsContainer.querySelectorAll('.line-item').length > 1) {
                 this.closest('.line-item').remove();
            } else {
                alert(translations[currentLanguage]?.alert_at_least_one_item || "You must have at least one line item.");
            }
        });
    });

    if (generatePdfBtn) {
        generatePdfBtn.addEventListener('click', function() {
            if (this.classList.contains('disabled')) return;

            const formData = new FormData(invoiceForm);
            const selectedDesignValue = document.querySelector('input[name="invoice_design"]:checked').value;
            formData.append('selected_design', selectedDesignValue);
            formData.append('lang', currentLanguage); // Send language

            fetch('/generate-pdf', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP error! status: ${response.status}, Message: ${text}`);
                    });
                }
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/pdf") !== -1) {
                    return response.blob();
                } else {
                    return response.text().then(text => {
                         throw new Error(`Expected PDF, but got: ${contentType}. Server message: ${text}`);
                    });
                }
            })
            .then(data => {
                if (data instanceof Blob) {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(data);
                    link.download = `invoice-${formData.get('invoice_number') || 'details'}-${currentLanguage}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                }
            })
            .catch(error => {
                console.error('Error generating PDF:', error);
                alert('Error generating PDF: ' + error.message);
            });
        });
    }

    setLanguage(currentLanguage);
});
