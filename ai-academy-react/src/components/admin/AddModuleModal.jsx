import { useState, useEffect } from 'react';
import { X, BookOpen, Plus, Save } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

function AddModuleModal({ onClose, onAddModule }) {
  const [formData, setFormData] = useState({
    title: '',
    icon: 'brain',
    lessons: ['']
  });

  const [errors, setErrors] = useState({});

  // Available icons
  const availableIcons = [
    { name: 'brain', label: 'Мозг', Component: LucideIcons.Brain },
    { name: 'cpu', label: 'Процессор', Component: LucideIcons.Cpu },
    { name: 'file-spreadsheet', label: 'Таблица', Component: LucideIcons.FileSpreadsheet },
    { name: 'image', label: 'Изображение', Component: LucideIcons.Image },
    { name: 'file-text', label: 'Документ', Component: LucideIcons.FileText }
  ];

  // Close modal on ESC key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Название модуля обязательно';
    }

    const validLessons = formData.lessons.filter(l => l.trim());
    if (validLessons.length === 0) {
      newErrors.lessons = 'Добавьте хотя бы один урок';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const validLessons = formData.lessons.filter(l => l.trim());

      const newModule = {
        id: Date.now(),
        title: formData.title.trim(),
        icon: formData.icon,
        lessons: validLessons,
        duration: validLessons.length * 45 // 45 minutes per lesson
      };

      onAddModule(newModule);
      onClose();
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddLesson = () => {
    setFormData(prev => ({
      ...prev,
      lessons: [...prev.lessons, '']
    }));
  };

  const handleLessonChange = (index, value) => {
    const newLessons = [...formData.lessons];
    newLessons[index] = value;
    setFormData(prev => ({ ...prev, lessons: newLessons }));

    if (errors.lessons) {
      setErrors(prev => ({ ...prev, lessons: '' }));
    }
  };

  const handleRemoveLesson = (index) => {
    const newLessons = formData.lessons.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, lessons: newLessons.length ? newLessons : [''] }));
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex-shrink-0 rounded-t-2xl">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Новый модуль</h2>
                <p className="text-sm opacity-90">Создание образовательного модуля</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Module Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Название модуля *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Например: Машинное обучение"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="text-red-600 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Иконка модуля *
            </label>
            <div className="grid grid-cols-5 gap-3">
              {availableIcons.map((icon) => {
                const IconComponent = icon.Component;
                return (
                  <button
                    key={icon.name}
                    type="button"
                    onClick={() => handleChange('icon', icon.name)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                      formData.icon === icon.name
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <IconComponent className={`w-6 h-6 ${
                      formData.icon === icon.name ? 'text-indigo-600' : 'text-gray-600'
                    }`} />
                    <span className="text-xs text-gray-600">{icon.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lessons */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Уроки *
            </label>
            <div className="space-y-2">
              {formData.lessons.map((lesson, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={lesson}
                    onChange={(e) => handleLessonChange(index, e.target.value)}
                    placeholder={`Урок ${index + 1}`}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  {formData.lessons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveLesson(index)}
                      className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.lessons && (
              <p className="text-red-600 text-xs mt-1">{errors.lessons}</p>
            )}
            <button
              type="button"
              onClick={handleAddLesson}
              className="mt-3 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              Добавить урок
            </button>
          </div>

          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
            <p className="text-xs text-indigo-800">
              После создания модуля вы сможете добавить к нему контент через раздел управления контентом.
            </p>
          </div>
        </form>

        {/* Footer Buttons */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0 rounded-b-2xl">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Отмена
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Создать модуль
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddModuleModal;
