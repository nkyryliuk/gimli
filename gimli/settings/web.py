from pathlib import Path
import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv(
    "DJANGO_SECRET_KEY", "django-insecure-default-key-for-development"
)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv("DEBUG", "True") == "True"

# Environment: 'development', 'production', etc.
ENV = os.getenv("ENV", "development")
IS_PRODUCTION = ENV == "production"

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite default dev server
    "http://localhost:5174",  # Alternative Vite port
]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
    # Third party apps
    "rest_framework",
    "rest_framework.authtoken",
    "corsheaders",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    "dj_rest_auth",
    "dj_rest_auth.registration",
    # Local apps
    "gimli.users.apps.UsersConfig",
    "gimli.lore.apps.LoreConfig",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "gimli.middleware.ErrorLoggingMiddleware",
    "gimli.middleware.RequestTimingMiddleware",
    "gimli.middleware.QueryTracingMiddleware",
]

# Add whitenoise middleware as the second middleware for production
if IS_PRODUCTION:
    MIDDLEWARE.insert(1, "whitenoise.middleware.WhiteNoiseMiddleware")

# Add security headers middleware
MIDDLEWARE.append("gimli.middleware.SecurityHeadersMiddleware")

MIDDLEWARE += [
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "allauth.account.middleware.AccountMiddleware",
]

ROOT_URLCONF = "gimli.urls"

# Set up template directories based on environment
TEMPLATE_DIRS = []
if IS_PRODUCTION:
    # Explicitly set the template directory to the root of the build
    TEMPLATE_DIRS.append(os.path.join(BASE_DIR, "frontend", "build", "client"))
    # Also look in the staticfiles directory after collectstatic has run
    TEMPLATE_DIRS.append(os.path.join(BASE_DIR, "staticfiles"))

# Configure templates
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": TEMPLATE_DIRS,
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "gimli.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME", "gimli"),
        "USER": os.getenv("DB_USER", "postgres"),
        "PASSWORD": os.getenv("DB_PASSWORD", "postgres"),
        "HOST": os.getenv("DB_HOST", "localhost"),
        "PORT": os.getenv("DB_PORT", "5432"),
        # Connection pooling settings
        "CONN_MAX_AGE": 120,  # Increased connection lifetime
        "CONN_HEALTH_CHECKS": True,
        "ATOMIC_REQUESTS": False,  # Disable auto-transactions for performance
        "OPTIONS": {
            "connect_timeout": 5,  # Lower timeout
            "keepalives_idle": 30,
            "keepalives_interval": 10,
            "keepalives_count": 5,
        },
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = "/assets/" if IS_PRODUCTION else "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

# Configure static files based on environment
STATICFILES_DIRS = []
if IS_PRODUCTION:
    # In production, add the frontend build directory to staticfiles dirs
    STATICFILES_DIRS = [
        os.path.join(BASE_DIR, "frontend", "build", "client"),
    ]
    # Use basic whitenoise storage without compression to avoid MIME type issues
    STATICFILES_STORAGE = "whitenoise.storage.StaticFilesStorage"

    # Add WhiteNoise configuration for proper static file handling
    WHITENOISE_INDEX_FILE = False  # Don't serve index.html for directory requests
    WHITENOISE_ROOT = os.path.join(
        BASE_DIR, "frontend", "build", "client"
    )  # Serve files from the build directory

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Google OAuth settings
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")

print(f"DEBUG: Loaded GOOGLE_CLIENT_ID: {'[SET]' if GOOGLE_CLIENT_ID else '[NOT SET]'}")

# Rest Framework settings
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}

# Authentication settings
SITE_ID = 1
AUTH_USER_MODEL = "users.CustomUser"

AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
]

# AllAuth settings
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_EMAIL_VERIFICATION = "none"  # Change to 'mandatory' in production
ACCOUNT_USERNAME_REQUIRED = False

# Social Account settings
SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "APP": {
            "client_id": os.getenv("GOOGLE_CLIENT_ID", ""),
            "secret": os.getenv("GOOGLE_CLIENT_SECRET", ""),
            "key": "",
        },
        "SCOPE": [
            "profile",
            "email",
        ],
        "AUTH_PARAMS": {
            "access_type": "online",
        },
    }
}

REST_AUTH = {
    "USE_JWT": True,
    "JWT_AUTH_COOKIE": "auth",
    "JWT_AUTH_REFRESH_COOKIE": "refresh-token",
    "JWT_AUTH_SECURE": True,
    "JWT_AUTH_HTTPONLY": True,
}

# JWT Settings
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60 * 24 * 30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "VERIFYING_KEY": None,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "BLACKLIST_AFTER_ROTATION": False,
    "UPDATE_LAST_LOGIN": False,
    "JTI_CLAIM": None,  # Disable JTI claim checking
    "SLIDING_TOKEN_REFRESH_EXP_CLAIM": None,  # Disable sliding claims
}

# SQL Query Logging - Enable in both dev and prod until performance issues are resolved
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {process:d} {thread:d} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "level": "WARNING",  # Set to WARNING to focus on slow queries only
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "loggers": {
        "django.request": {
            "handlers": ["console"],
            "level": "WARNING",
            "propagate": False,
        },
        "django.db.backends": {
            "handlers": ["console"],
            "level": "DEBUG",  # Changed from WARNING to DEBUG to log all individual queries
            "propagate": False,
        },
    },
}
