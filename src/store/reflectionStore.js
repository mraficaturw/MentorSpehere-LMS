import { create } from 'zustand';

const useReflectionStore = create((set, get) => ({
  dailyReflection: null,
  weeklyInsight: null,
  learningPath: null,
  riskScore: null,
  isLoading: false,
  isGenerating: false,
  error: null,

  setDailyReflection: (reflection) => set({ dailyReflection: reflection }),
  setWeeklyInsight: (insight) => set({ weeklyInsight: insight }),
  setLearningPath: (path) => set({ learningPath: path }),
  setRiskScore: (score) => set({ riskScore: score }),

  setAllReflections: (data) => set({
    dailyReflection: data.daily,
    weeklyInsight: data.weekly,
    learningPath: data.learningPath,
    riskScore: data.riskAssessment,
  }),

  generateReflection: async (generateFunction) => {
    set({ isGenerating: true, error: null });
    try {
      const reflection = await generateFunction();
      set({
        dailyReflection: reflection.daily,
        weeklyInsight: reflection.weekly,
        learningPath: reflection.learningPath,
        riskScore: reflection.riskAssessment,
        isGenerating: false,
      });
      return reflection;
    } catch (error) {
      set({ error: error.message, isGenerating: false });
      throw error;
    }
  },

  clearReflections: () => set({
    dailyReflection: null,
    weeklyInsight: null,
    learningPath: null,
    riskScore: null,
    error: null,
  }),
}));

export default useReflectionStore;
