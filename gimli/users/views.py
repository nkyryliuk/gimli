from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class UserDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        })

class GoogleLoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        try:
            id_token_value = request.data.get('id_token')
            if not id_token_value:
                return Response(
                    {'error': 'No ID token provided'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                idinfo = id_token.verify_oauth2_token(
                    id_token_value,
                    requests.Request(),
                    settings.GOOGLE_CLIENT_ID
                )
                
                email = idinfo.get('email')
                if not email:
                    return Response(
                        {'error': 'Email not found in token'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )

                user, created = User.objects.get_or_create(
                    email=email,
                    defaults={
                        'username': email,
                        'first_name': idinfo.get('given_name', ''),
                        'last_name': idinfo.get('family_name', ''),
                        'is_active': True
                    }
                )

                refresh = RefreshToken.for_user(user)
                tokens = {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }

                return Response({
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                    },
                    'tokens': tokens
                })

            except ValueError as e:
                return Response(
                    {'error': f'Invalid token: {str(e)}'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )

        except Exception as e:
            return Response(
                {'error': 'Authentication failed'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ) 