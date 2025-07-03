# ai/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def ask_ai_view(request):
    # Example dummy response
    question = request.data.get("question", "")
    return Response({"response": f"You asked: {question}"})
