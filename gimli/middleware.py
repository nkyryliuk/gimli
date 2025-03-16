import logging
import traceback
from django.http import JsonResponse
from django.conf import settings
import time
from django.db import connection, reset_queries

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
                "script-src https://accounts.google.com/gsi/client 'self' 'unsafe-inline'; "
                "frame-src https://accounts.google.com/gsi/; "
                "connect-src https://accounts.google.com/gsi/ 'self';"
            )
            response["Content-Security-Policy-Report-Only"] = csp_value

        return response


class RequestTimingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Start timing
        start_time = time.time()

        # Process the request
        response = self.get_response(request)

        # Calculate duration
        duration = time.time() - start_time

        # Log if request is slow (over 200ms)
        if duration > 0.2:
            logger.warning(
                f"SLOW REQUEST: {request.method} {request.path} took {duration*1000:.2f}ms"
            )

        # Add timing header to response
        response["X-Request-Time"] = f"{duration*1000:.2f}ms"

        return response


class QueryTracingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Clear any existing queries
        reset_queries()

        # Record start time
        start = time.time()

        # Process the request
        response = self.get_response(request)

        # Calculate duration
        duration = time.time() - start

        # Only log API requests to avoid cluttering logs
        if request.path.startswith("/api/"):
            # Count and time the queries
            query_count = len(connection.queries)
            query_time = (
                sum(float(q["time"]) for q in connection.queries)
                if query_count > 0
                else 0
            )

            # Log the timing info
            logger.warning(
                f"REQUEST TRACE: {request.method} {request.path} - "
                f"Total: {duration*1000:.2f}ms, "
                f"DB Queries: {query_count} in {query_time*1000:.2f}ms, "
                f"Python time: {(duration-query_time)*1000:.2f}ms"
            )

            # Log detailed query info for slow requests
            if duration > 0.5:  # Slow requests (over 500ms)
                for i, query in enumerate(
                    connection.queries[:5]
                ):  # Show only first 5 queries
                    logger.warning(
                        f"  Query {i+1}: {float(query['time'])*1000:.2f}ms - {query['sql'][:150]}..."
                    )

        # Add header with timing info
        response["X-Request-Duration"] = f"{duration*1000:.2f}ms"
        if query_count > 0:
            response["X-DB-Query-Count"] = str(query_count)
            response["X-DB-Query-Duration"] = f"{query_time*1000:.2f}ms"

        return response
