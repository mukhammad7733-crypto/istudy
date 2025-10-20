from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import (
    User, Module, Lesson, Question, Answer,
    UserProgress, TestResult, AIAgent, AIAgentQuestion
)
from .serializers import (
    UserSerializer, UserDetailSerializer, ModuleSerializer, LessonSerializer,
    QuestionSerializer, AnswerSerializer, UserProgressSerializer,
    TestResultSerializer, AIAgentSerializer, AIAgentQuestionSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for User model
    Endpoints:
    - GET /api/users/ - List all users
    - POST /api/users/ - Create new user
    - GET /api/users/{id}/ - Get user detail
    - PUT /api/users/{id}/ - Update user
    - DELETE /api/users/{id}/ - Delete user
    - GET /api/users/{id}/detail/ - Get detailed user info with progress
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_serializer_class(self):
        if self.action == 'detail_with_progress':
            return UserDetailSerializer
        return UserSerializer

    @action(detail=True, methods=['get'])
    def detail_with_progress(self, request, pk=None):
        """Get detailed user information including progress and test results"""
        user = self.get_object()
        serializer = UserDetailSerializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search users by name, email or department"""
        query = request.query_params.get('q', '')
        users = self.queryset.filter(
            Q(username__icontains=query) |
            Q(email__icontains=query) |
            Q(department__icontains=query)
        )
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)


class ModuleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Module model
    Endpoints:
    - GET /api/modules/ - List all modules
    - POST /api/modules/ - Create new module
    - GET /api/modules/{id}/ - Get module detail with lessons
    - PUT /api/modules/{id}/ - Update module
    - DELETE /api/modules/{id}/ - Delete module
    """
    queryset = Module.objects.filter(is_active=True).prefetch_related('lessons', 'questions')
    serializer_class = ModuleSerializer

    @action(detail=False, methods=['get'])
    def all_with_inactive(self, request):
        """Get all modules including inactive ones"""
        modules = Module.objects.all().prefetch_related('lessons', 'questions')
        serializer = self.get_serializer(modules, many=True)
        return Response(serializer.data)


class LessonViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Lesson model
    Endpoints:
    - GET /api/lessons/ - List all lessons
    - POST /api/lessons/ - Create new lesson
    - GET /api/lessons/{id}/ - Get lesson detail
    - PUT /api/lessons/{id}/ - Update lesson
    - DELETE /api/lessons/{id}/ - Delete lesson
    - GET /api/lessons/module/{module_id}/ - Get lessons by module
    """
    queryset = Lesson.objects.all().select_related('module')
    serializer_class = LessonSerializer

    @action(detail=False, methods=['get'])
    def by_module(self, request):
        """Get lessons filtered by module ID"""
        module_id = request.query_params.get('module_id')
        if module_id:
            lessons = self.queryset.filter(module_id=module_id)
            serializer = self.get_serializer(lessons, many=True)
            return Response(serializer.data)
        return Response({'error': 'module_id parameter required'}, status=status.HTTP_400_BAD_REQUEST)


class QuestionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Question model with answers
    Endpoints:
    - GET /api/questions/ - List all questions
    - POST /api/questions/ - Create new question
    - GET /api/questions/{id}/ - Get question detail with answers
    - PUT /api/questions/{id}/ - Update question
    - DELETE /api/questions/{id}/ - Delete question
    - GET /api/questions/module/{module_id}/ - Get questions by module
    """
    queryset = Question.objects.all().prefetch_related('answers').select_related('module', 'lesson')
    serializer_class = QuestionSerializer

    @action(detail=False, methods=['get'])
    def by_module(self, request):
        """Get questions filtered by module ID"""
        module_id = request.query_params.get('module_id')
        if module_id:
            questions = self.queryset.filter(module_id=module_id)
            serializer = self.get_serializer(questions, many=True)
            return Response(serializer.data)
        return Response({'error': 'module_id parameter required'}, status=status.HTTP_400_BAD_REQUEST)


class UserProgressViewSet(viewsets.ModelViewSet):
    """
    ViewSet for UserProgress model
    Endpoints:
    - GET /api/progress/ - List all progress records
    - POST /api/progress/ - Create/update progress
    - GET /api/progress/{id}/ - Get progress detail
    - PUT /api/progress/{id}/ - Update progress
    - DELETE /api/progress/{id}/ - Delete progress
    - GET /api/progress/user/{user_id}/ - Get progress by user
    """
    queryset = UserProgress.objects.all().select_related('user', 'module')
    serializer_class = UserProgressSerializer

    @action(detail=False, methods=['get'])
    def by_user(self, request):
        """Get progress filtered by user ID"""
        user_id = request.query_params.get('user_id')
        if user_id:
            progress = self.queryset.filter(user_id=user_id)
            serializer = self.get_serializer(progress, many=True)
            return Response(serializer.data)
        return Response({'error': 'user_id parameter required'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def update_or_create(self, request):
        """Update or create user progress"""
        user_id = request.data.get('user_id')
        module_id = request.data.get('module_id')

        if not user_id or not module_id:
            return Response({'error': 'user_id and module_id required'}, status=status.HTTP_400_BAD_REQUEST)

        progress, created = UserProgress.objects.get_or_create(
            user_id=user_id,
            module_id=module_id,
            defaults={
                'started': request.data.get('started', False),
                'viewed_lessons': request.data.get('viewed_lessons', 0),
                'completed_lessons': request.data.get('completed_lessons', 0),
                'total_lessons': request.data.get('total_lessons', 0)
            }
        )

        if not created:
            for field in ['started', 'viewed_lessons', 'completed_lessons', 'total_lessons']:
                if field in request.data:
                    setattr(progress, field, request.data[field])
            progress.save()

        serializer = self.get_serializer(progress)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class TestResultViewSet(viewsets.ModelViewSet):
    """
    ViewSet for TestResult model
    Endpoints:
    - GET /api/test-results/ - List all test results
    - POST /api/test-results/ - Create new test result (replaces old one for same module)
    - GET /api/test-results/{id}/ - Get test result detail
    - PUT /api/test-results/{id}/ - Update test result
    - DELETE /api/test-results/{id}/ - Delete test result
    - GET /api/test-results/user/{user_id}/ - Get results by user
    """
    queryset = TestResult.objects.all().select_related('user', 'module', 'lesson')
    serializer_class = TestResultSerializer

    def create(self, request, *args, **kwargs):
        """Create new test result, replacing any existing result for the same module"""
        user_id = request.data.get('user')
        module_id = request.data.get('module')

        if user_id and module_id:
            # Удаляем предыдущий результат для этого модуля (если есть)
            TestResult.objects.filter(
                user_id=user_id,
                module_id=module_id,
                lesson__isnull=True  # Только результаты итогового теста модуля
            ).delete()

        return super().create(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def by_user(self, request):
        """Get test results filtered by user ID"""
        user_id = request.query_params.get('user_id')
        if user_id:
            results = self.queryset.filter(user_id=user_id)
            serializer = self.get_serializer(results, many=True)
            return Response(serializer.data)
        return Response({'error': 'user_id parameter required'}, status=status.HTTP_400_BAD_REQUEST)


class AIAgentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for AIAgent model
    Endpoints:
    - GET /api/ai-agents/ - List all AI agents
    - POST /api/ai-agents/ - Create new AI agent
    - GET /api/ai-agents/{id}/ - Get AI agent detail
    - PUT /api/ai-agents/{id}/ - Update AI agent
    - DELETE /api/ai-agents/{id}/ - Delete AI agent
    - GET /api/ai-agents/user/{user_id}/ - Get agent by user
    """
    queryset = AIAgent.objects.all().select_related('user')
    serializer_class = AIAgentSerializer

    @action(detail=False, methods=['get'])
    def by_user(self, request):
        """Get AI agent filtered by user ID"""
        user_id = request.query_params.get('user_id')
        if user_id:
            try:
                agent = self.queryset.get(user_id=user_id)
                serializer = self.get_serializer(agent)
                return Response(serializer.data)
            except AIAgent.DoesNotExist:
                return Response({'error': 'AI agent not found for this user'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'user_id parameter required'}, status=status.HTTP_400_BAD_REQUEST)


class AIAgentQuestionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for AIAgentQuestion model (read-only)
    Endpoints:
    - GET /api/ai-agent-questions/ - List all questions with options
    - GET /api/ai-agent-questions/{id}/ - Get question detail
    """
    queryset = AIAgentQuestion.objects.all().prefetch_related('options')
    serializer_class = AIAgentQuestionSerializer
