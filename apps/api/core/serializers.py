from rest_framework import serializers
from .models import Profile, Plant, CareTask, PlantCareLog, AIChatSession, AIChatMessage

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

class PlantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plant
        fields = '__all__'

class CareTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareTask
        fields = '__all__'

class PlantCareLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlantCareLog
        fields = '__all__'

class AIChatSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIChatSession
        fields = '__all__'

class AIChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIChatMessage
        fields = '__all__'
