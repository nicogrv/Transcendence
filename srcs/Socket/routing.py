from django.urls import re_path

from .pong import Test

websocket_urlpatterns = [
    re_path(r'', Test.as_asgi()),
]