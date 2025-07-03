# core/views.py
from django.http import JsonResponse
from rest_framework import viewsets
from .models import (
    Profile,
    Plant,
    CareTask,
    PlantCareLog,
    AIChatSession,
    AIChatMessage,
)
from .serializers import (
    ProfileSerializer,
    PlantSerializer,
    CareTaskSerializer,
    PlantCareLogSerializer,
    AIChatSessionSerializer,
    AIChatMessageSerializer,
)


def health_check(request):
    return JsonResponse({"status": "ok"})


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


class PlantViewSet(viewsets.ModelViewSet):
    queryset = Plant.objects.all()
    serializer_class = PlantSerializer


class CareTaskViewSet(viewsets.ModelViewSet):
    queryset = CareTask.objects.all()
    serializer_class = CareTaskSerializer


class PlantCareLogViewSet(viewsets.ModelViewSet):
    queryset = PlantCareLog.objects.all()
    serializer_class = PlantCareLogSerializer


class AIChatSessionViewSet(viewsets.ModelViewSet):
    queryset = AIChatSession.objects.all()
    serializer_class = AIChatSessionSerializer


class AIChatMessageViewSet(viewsets.ModelViewSet):
    queryset = AIChatMessage.objects.all()
    serializer_class = AIChatMessageSerializer