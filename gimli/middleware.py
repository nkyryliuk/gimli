import logging
import traceback
from django.http import JsonResponse

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
