from django.urls import path
from .views import ask_ai_view  # Or whatever view you're exposing

urlpatterns = [
    path('ask/', ask_ai_view, name='ask_ai'),
]