# core/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProfileViewSet,
    PlantViewSet,
    CareTaskViewSet,
    PlantCareLogViewSet,
    AIChatSessionViewSet,
    AIChatMessageViewSet,
)

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet)
router.register(r'plants', PlantViewSet)
router.register(r'care-tasks', CareTaskViewSet)
router.register(r'plant-care-logs', PlantCareLogViewSet)
router.register(r'ai-chat-sessions', AIChatSessionViewSet)
router.register(r'ai-chat-messages', AIChatMessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
