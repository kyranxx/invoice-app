import pytest

from app import app as flask_app  # Import your Flask app instance

# If you use an app factory pattern (create_app function):
# from app import create_app
#
# @pytest.fixture(scope='module')
# def app():
#     """Instance of Main flask app"""
#     return create_app()


@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    # If you have a create_app factory:
    # _app = create_app({"TESTING": True})
    # else, use the imported app instance directly:
    _app = flask_app
    _app.config.update(
        {
            "TESTING": True,
        }
    )
    yield _app


@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()


@pytest.fixture
def runner(app):
    """A test runner for the app's Click commands."""
    return app.test_cli_runner()


def test_index_route(client):
    """Test that the index page loads correctly."""
    response = client.get("/")
    assert response.status_code == 200
    assert (
        b"Invoice Generator" in response.data
    )  # Check for some text from your index.html


def test_get_template_route_exists(client):
    """Test that a valid template can be fetched."""
    response = client.get("/get-template/design1")
    assert response.status_code == 200
    assert response.content_type == "text/html"
    # Check for some common HTML tag or structure
    assert b"<html" in response.data.lower() or b"<div" in response.data.lower()


def test_get_template_route_not_found(client):
    """Test fetching a non-existent template."""
    response = client.get(
        "/get-template/design999"
    )  # Assuming design999 does not exist
    assert response.status_code == 404
    assert b"not found" in response.data.lower()


def test_generate_pdf_route_basic(client):
    """Test basic PDF generation."""
    # This is a very basic test. You'll want to expand this.
    # For example, check the PDF content if possible, or at least that it's a PDF.
    data = {
        "client_name": "Test Client",
        "client_address": "123 Test St",
        "selected_design": "design1",
    }
    response = client.post("/generate-pdf", data=data)
    assert response.status_code == 200
    assert response.content_type == "application/pdf"
    assert response.headers["Content-Disposition"].startswith(
        "attachment; filename=invoice.pdf"
    )
    # Check if PDF is not empty and has some PDF magic bytes
    assert len(response.data) > 100  # Arbitrary small number, real PDFs are larger
    assert response.data.startswith(b"%PDF-")


def test_generate_pdf_route_missing_css_gracefully(client, mocker):
    """Test PDF generation if a CSS file is missing (it should still generate)."""

    # Mock os.path.exists to simulate a missing CSS file for a specific design
    # Let's assume design2's CSS is missing for this test
    def mock_os_path_exists(path):
        if "invoice_design_2.css" in path:
            return False
        return True  # Original behavior for other paths

    mocker.patch("os.path.exists", side_effect=mock_os_path_exists)

    data = {
        "client_name": "Test Client CSS Missing",
        "client_address": "456 Test Ave",
        "selected_design": "design2",  # This design will have its CSS "missing"
    }
    response = client.post("/generate-pdf", data=data)
    assert response.status_code == 200
    assert response.content_type == "application/pdf"
    # We expect a PDF even if a specific design's CSS is missing
    assert response.data.startswith(b"%PDF-")


# Add more tests here:
# - Test with different designs
# - Test with more complex form data for PDF generation
# - Test edge cases for PDF generation (e.g., empty client name)
# - If you add more items to the invoice, test those.
