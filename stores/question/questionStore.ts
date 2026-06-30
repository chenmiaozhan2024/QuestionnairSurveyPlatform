// store/surveyStore.ts
import { create } from 'zustand'
import type { SurveyState } from './type'

export const useSurveyStore = create<SurveyState>((set) => ({
  title: '',
  info: '',
  questions: [],

  setTitle: (title) => set({ title }),
  setInfo: (info) => set({ info }),

  addQuestion: (question) =>
    set((state) => ({ questions: [...state.questions, question] })),

  removeQuestion: (index) =>
    set((state) => ({
      questions: state.questions.filter((_, i) => i !== index),
    })),

  updateQuestion: (id, updates) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === id ? { ...q, ...updates } : q,
      ),
    })),

  resetSurvey: () => set({ title: '', info: '', questions: [] }),

  setQuestions: (questions) => set({ questions }),
}))
