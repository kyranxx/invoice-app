# Makefile for Python Project

.PHONY: help install-dev lint format format-check test test-cov check-all clean

# Default target when no arguments are given to make.
help:
	@echo "Available commands:"
	@echo "  install-dev    Install development dependencies"
	@echo "  lint           Run linters (flake8)"
	@echo "  format         Format code (black, isort)"
	@echo "  format-check   Check formatting without making changes"
	@echo "  test           Run tests with pytest"
	@echo "  test-cov       Run tests with pytest and generate coverage report"
	@echo "  check-all      Run format, lint, and test"
	@echo "  pre-commit-run Run pre-commit hooks on all files"
	@echo "  clean          Remove temporary files and caches"

install-dev:
	pip install -r requirements-dev.txt
	pip install -r requirements.txt # Ensure main deps are also installed/updated
	pre-commit install # Install pre-commit hooks

lint:
	@echo "Running linters (flake8)..."
	flake8 .

format:
	@echo "Formatting code (black and isort)..."
	black .
	isort .

format-check:
	@echo "Checking code formatting (black and isort)..."
	black --check .
	isort --check .

test:
	@echo "Running tests (pytest)..."
	python -m pytest

test-cov:
	@echo "Running tests with coverage (pytest)..."
	python -m pytest --cov=app --cov-report=html --cov-report=term
	@echo "Coverage report generated in htmlcov/index.html"

check-all: format lint test
	@echo "All checks (format, lint, test) passed."

pre-commit-run:
	@echo "Running pre-commit hooks on all files..."
	pre-commit run --all-files

clean:
	@echo "Cleaning up temporary files..."
	find . -type f -name "*.py[co]" -delete
	find . -type d -name "__pycache__" -delete
	rm -rf .pytest_cache
	rm -rf .mypy_cache
	rm -rf htmlcov
	rm -f .coverage
	rm -rf *.egg-info
	rm -rf build
	rm -rf dist
	# Add other clean commands if needed
