from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, ModuleViewSet, LessonViewSet, QuestionViewSet,
    UserProgressViewSet, TestResultViewSet, AIAgentViewSet, AIAgentQuestionViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'modules', ModuleViewSet, basename='module')
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'questions', QuestionViewSet, basename='question')
router.register(r'progress', UserProgressViewSet, basename='progress')
router.register(r'test-results', TestResultViewSet, basename='testresult')
router.register(r'ai-agents', AIAgentViewSet, basename='aiagent')
router.register(r'ai-agent-questions', AIAgentQuestionViewSet, basename='aiagentquestion')

urlpatterns = [
    path('', include(router.urls)),
]
