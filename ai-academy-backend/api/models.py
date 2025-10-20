from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator


class User(AbstractUser):
    """Custom User model for students and admins"""
    email = models.EmailField(unique=True)
    department = models.CharField(max_length=100, default='Общий')
    role = models.CharField(
        max_length=20,
        choices=[('admin', 'Admin'), ('student', 'Student')],
        default='student'
    )
    time_spent = models.IntegerField(default=0, help_text='Total time spent in minutes')
    last_activity = models.DateField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.username} ({self.email})"


class Module(models.Model):
    """Learning modules"""
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(
        max_length=50,
        choices=[
            ('Brain', 'Brain'),
            ('Cpu', 'CPU'),
            ('FileSpreadsheet', 'FileSpreadsheet'),
            ('Image', 'Image'),
            ('FileText', 'FileText')
        ],
        default='Brain'
    )
    duration = models.IntegerField(help_text='Duration in minutes')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'modules'
        ordering = ['order', 'id']

    def __str__(self):
        return self.title


class Lesson(models.Model):
    """Lessons within modules"""
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    content = models.TextField()
    video_url = models.URLField(blank=True, null=True)
    video_title = models.CharField(max_length=200, blank=True, null=True)
    video_channel = models.CharField(max_length=200, blank=True, null=True)
    video_duration = models.CharField(max_length=50, blank=True, null=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'lessons'
        ordering = ['order', 'id']
        unique_together = ['module', 'order']

    def __str__(self):
        return f"{self.module.title} - {self.title}"


class Question(models.Model):
    """Test questions for modules"""
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='questions')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='questions', null=True, blank=True)
    question_text = models.TextField()
    question_type = models.CharField(
        max_length=20,
        choices=[('single', 'Single Choice'), ('multiple', 'Multiple Choice')],
        default='single'
    )
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'questions'
        ordering = ['order', 'id']

    def __str__(self):
        return f"Question {self.order + 1} - {self.module.title}"


class Answer(models.Model):
    """Answer options for questions"""
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    answer_text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)
    order = models.IntegerField(default=0)

    class Meta:
        db_table = 'answers'
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.question.question_text[:50]} - {self.answer_text[:30]}"


class UserProgress(models.Model):
    """Track user progress through modules"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progress')
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='user_progress')
    started = models.BooleanField(default=False)
    viewed_lessons = models.IntegerField(default=0)
    completed_lessons = models.IntegerField(default=0)
    total_lessons = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_progress'
        unique_together = ['user', 'module']

    def __str__(self):
        return f"{self.user.username} - {self.module.title}"


class TestResult(models.Model):
    """Test results for users"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='test_results')
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='test_results')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='test_results', null=True, blank=True)
    score = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    passed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'test_results'
        ordering = ['-completed_at']

    def __str__(self):
        return f"{self.user.username} - {self.module.title} - {self.score}%"


class AIAgent(models.Model):
    """AI Agent configurations for users"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='ai_agent')
    area = models.CharField(max_length=200)
    autonomy_level = models.CharField(max_length=200)
    data_types = models.CharField(max_length=200)
    language_model = models.CharField(max_length=200)
    response_speed = models.CharField(max_length=200)
    integrations = models.CharField(max_length=200)
    personalization = models.CharField(max_length=200)
    success_metrics = models.CharField(max_length=200)
    learning_capability = models.CharField(max_length=200)
    budget = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ai_agents'

    def __str__(self):
        return f"AI Agent for {self.user.username}"


class AIAgentQuestion(models.Model):
    """Questions for AI agent creation"""
    question_id = models.IntegerField(unique=True)
    question_text = models.TextField()
    order = models.IntegerField(default=0)

    class Meta:
        db_table = 'ai_agent_questions'
        ordering = ['order', 'question_id']

    def __str__(self):
        return f"Question {self.question_id}"


class AIAgentQuestionOption(models.Model):
    """Options for AI agent questions"""
    question = models.ForeignKey(AIAgentQuestion, on_delete=models.CASCADE, related_name='options')
    option_text = models.CharField(max_length=200)
    order = models.IntegerField(default=0)

    class Meta:
        db_table = 'ai_agent_question_options'
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.question.question_id} - {self.option_text}"
