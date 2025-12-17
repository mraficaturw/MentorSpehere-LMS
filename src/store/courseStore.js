import { create } from 'zustand';

const useCourseStore = create((set, get) => ({
  courseList: [],
  selectedCourse: null,
  isLoading: false,
  error: null,

  setCourses: (courses) => set({ courseList: courses }),
  
  fetchCourses: async (fetchFunction) => {
    set({ isLoading: true, error: null });
    try {
      const courses = await fetchFunction();
      set({ courseList: courses, isLoading: false });
      return courses;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  setSelectedCourse: (course) => set({ selectedCourse: course }),
  
  clearSelectedCourse: () => set({ selectedCourse: null }),

  updateCourseProgress: (courseId, progress) => {
    set((state) => ({
      courseList: state.courseList.map((course) =>
        course.id === courseId ? { ...course, progress } : course
      ),
    }));
  },

  getCourseById: (courseId) => {
    return get().courseList.find((course) => course.id === courseId);
  },
}));

export default useCourseStore;
