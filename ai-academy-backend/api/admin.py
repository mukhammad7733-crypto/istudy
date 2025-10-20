from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User, Module, Lesson, Question, Answer,
    UserProgress, TestResult, AIAgent, AIAgentQuestion, AIAgentQuestionOption
)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'role', 'department', 'last_activity']
    list_filter = ['role', 'department', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['-date_joined']

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('department', 'role', 'time_spent', 'last_activity')}),
    )


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1
    fields = ['title', 'order', 'video_url']


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ['title', 'icon', 'duration', 'order', 'is_active', 'created_at']
    list_filter = ['is_active', 'icon']
    search_fields = ['title', 'description']
    ordering = ['order', 'id']
    inlines = [LessonInline]


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'module', 'order', 'created_at']
    list_filter = ['module']
    search_fields = ['title', 'content']
    ordering = ['module', 'order']


class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 4
    fields = ['answer_text', 'is_correct', 'order']


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['question_text', 'module', 'lesson', 'question_type', 'order']
    list_filter = ['module', 'question_type']
    search_fields = ['question_text']
    ordering = ['module', 'order']
    inlines = [AnswerInline]


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ['answer_text', 'question', 'is_correct', 'order']
    list_filter = ['is_correct', 'question__module']
    search_fields = ['answer_text']


@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'module', 'started', 'viewed_lessons', 'completed_lessons', 'updated_at']
    list_filter = ['started', 'module']
    search_fields = ['user__username', 'user__email', 'module__title']
    ordering = ['-updated_at']


@admin.register(TestResult)
class TestResultAdmin(admin.ModelAdmin):
    list_display = ['user', 'module', 'lesson', 'score', 'passed', 'completed_at']
    list_filter = ['passed', 'module', 'completed_at']
    search_fields = ['user__username', 'user__email', 'module__title']
    ordering = ['-completed_at']


@admin.register(AIAgent)
class AIAgentAdmin(admin.ModelAdmin):
    list_display = ['user', 'language_model', 'area', 'personalization', 'created_at']
    search_fields = ['user__username', 'user__email']
    ordering = ['-created_at']


class AIAgentQuestionOptionInline(admin.TabularInline):
    model = AIAgentQuestionOption
    extra = 4
    fields = ['option_text', 'order']


@admin.register(AIAgentQuestion)
class AIAgentQuestionAdmin(admin.ModelAdmin):
    list_display = ['question_id', 'question_text', 'order']
    ordering = ['order', 'question_id']
    inlines = [AIAgentQuestionOptionInline]


@admin.register(AIAgentQuestionOption)
class AIAgentQuestionOptionAdmin(admin.ModelAdmin):
    list_display = ['question', 'option_text', 'order']
    list_filter = ['question']
    ordering = ['question', 'order']
