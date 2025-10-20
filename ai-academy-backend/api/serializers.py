from rest_framework import serializers
from .models import (
    User, Module, Lesson, Question, Answer,
    UserProgress, TestResult, AIAgent, AIAgentQuestion, AIAgentQuestionOption
)


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'department', 'role', 'time_spent', 'last_activity',
            'created_at', 'password'
        ]
        read_only_fields = ['id', 'created_at', 'last_activity']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_password('password123')  # Default password
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'answer_text', 'is_correct', 'order']


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'question_text', 'question_type', 'order', 'answers']


class LessonSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'content', 'video_url', 'video_title',
            'video_channel', 'video_duration', 'order', 'questions'
        ]


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)
    lesson_count = serializers.SerializerMethodField()

    class Meta:
        model = Module
        fields = [
            'id', 'title', 'description', 'icon', 'duration',
            'order', 'is_active', 'lessons', 'questions', 'lesson_count'
        ]

    def get_lesson_count(self, obj):
        return obj.lessons.count()


class UserProgressSerializer(serializers.ModelSerializer):
    module_title = serializers.CharField(source='module.title', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = UserProgress
        fields = [
            'id', 'user', 'user_name', 'module', 'module_title',
            'started', 'viewed_lessons', 'completed_lessons',
            'total_lessons', 'updated_at'
        ]


class TestResultSerializer(serializers.ModelSerializer):
    module_title = serializers.CharField(source='module.title', read_only=True)
    lesson_title = serializers.CharField(source='lesson.title', read_only=True, allow_null=True)
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = TestResult
        fields = [
            'id', 'user', 'user_name', 'module', 'module_title',
            'lesson', 'lesson_title', 'score', 'passed', 'completed_at'
        ]


class AIAgentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = AIAgent
        fields = [
            'id', 'user', 'user_name', 'area', 'autonomy_level',
            'data_types', 'language_model', 'response_speed',
            'integrations', 'personalization', 'success_metrics',
            'learning_capability', 'budget', 'created_at'
        ]


class AIAgentQuestionOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIAgentQuestionOption
        fields = ['id', 'option_text', 'order']


class AIAgentQuestionSerializer(serializers.ModelSerializer):
    options = AIAgentQuestionOptionSerializer(many=True, read_only=True)

    class Meta:
        model = AIAgentQuestion
        fields = ['id', 'question_id', 'question_text', 'order', 'options']


class UserDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer with all user data including progress and test results"""
    progress = UserProgressSerializer(many=True, read_only=True)
    test_results = TestResultSerializer(many=True, read_only=True)
    ai_agent = AIAgentSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'department', 'role', 'time_spent', 'last_activity',
            'created_at', 'progress', 'test_results', 'ai_agent'
        ]
