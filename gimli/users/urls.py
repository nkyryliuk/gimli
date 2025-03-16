from django.urls import path
from .views import GoogleLoginView, UserDetailsView

urlpatterns = [
    path('google/', GoogleLoginView.as_view(), name='google_login'),
    path('user/', UserDetailsView.as_view(), name='user_details'),
] 