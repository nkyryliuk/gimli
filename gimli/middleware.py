import logging
import traceback
from django.http import JsonResponse
from django.conf import settings

logger = logging.getLogger("django.request")


class ErrorLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_exception(self, request, exception):
        """Log the exception and provide more details about what failed"""
        # Get the full traceback
        tb = traceback.format_exc()

        # Log exception with additional info
        logger.error(
            f"Exception encountered: {type(exception).__name__}: {str(exception)}\n"
            f"Path: {request.path}\n"
            f"Method: {request.method}\n"
            f"Traceback:\n{tb}"
        )

        # Return a simple 500 response when not in DEBUG mode
        return None  # Let Django's default error handling proceed


class SecurityHeadersMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Only apply security headers in production
        if settings.IS_PRODUCTION:
            # Required for Google Sign-In popups to work properly
            response["Cross-Origin-Opener-Policy"] = "same-origin-allow-popups"

            # Specific CSP directive required for Google Identity Services
            csp_value = (
                "script-src https://accounts.google.com/gsi/client; "
                "frame-src https://accounts.google.com/gsi/; "
                "connect-src https://accounts.google.com/gsi/;"
            )
            response["Content-Security-Policy-Report-Only"] = csp_value

        return response
