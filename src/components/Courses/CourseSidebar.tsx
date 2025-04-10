import { useState, useEffect } from "react";
import {
  FiChevronUp,
  FiChevronDown,
  FiBook,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export const CourseSidebar = ({
  course,
  lessons,
  selectedLesson,
  onLessonSelect,
}: {
  course: any;
  lessons: any;
  selectedLesson: any;
  onLessonSelect: (lesson: any) => void;
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    // Auto-expand section containing the selected lesson
    if (
      selectedLesson &&
      !expandedSections.includes(selectedLesson.sectionId)
    ) {
      setExpandedSections((prev) => [...prev, selectedLesson.sectionId]);
    }

    // Close mobile sidebar when a lesson is selected
    if (selectedLesson && isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  }, [selectedLesson]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  if (!course) return null;

  // Group lessons by section for easier rendering
  const lessonsBySection = course.sectionIds.map((section: any) => ({
    section,
    lessons: lessons.filter((lesson: any) => lesson.sectionId === section._id),
  }));
  const calculateProgress = (sectionId: string): number => {
    const section = course?.sectionIds.find((s: any) => s._id === sectionId);
    if (!section || section.totalLessons === 0) return 0;
    return Math.round((section.completedLessons / section.totalLessons) * 100);
  };

  return (
    <>
      {/* Mobile sidebar toggle button */}
      <div className="md:hidden fixed bottom-4 right-4 z-20">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="bg-color-secondary text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="Open course navigation"
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - responsive for mobile and desktop */}
      <AnimatePresence>
        {(isMobileSidebarOpen || true) && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: isMobileSidebarOpen ? 0 : 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className={`bg-background border-r flex flex-col z-40 ${
              isMobileSidebarOpen
                ? "fixed inset-y-0 left-0 w-4/5 max-w-xs"
                : "hidden md:flex w-full md:w-80"
            }`}
          >
            {/* Course header */}
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-background z-10">
              <div className="flex items-center gap-2">
                <FiBook className="text-text" size={20} />
                <h2 className="text-lg font-bold truncate text-text">
                  {course.title}
                </h2>
              </div>

              {isMobileSidebarOpen && (
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                  aria-label="Close sidebar"
                >
                  <FiX size={20} />
                </button>
              )}
            </div>

            {/* Course content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {lessonsBySection.map(({ section, lessons }: any) => (
                <div
                  key={section._id}
                  className="space-y-2 rounded-lg overflow-hidden border border-gray-100 shadow-sm"
                >
                  <button
                    onClick={() => toggleSection(section._id)}
                    className="w-full flex items-center justify-between p-3 bg-background transition-colors"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium truncate text-text">
                        {section.title}
                      </span>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{
                              width: `${calculateProgress(section._id)}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {calculateProgress(section._id)}%
                        </span>
                      </div>
                    </div>
                    {expandedSections.includes(section._id) ? (
                      <FiChevronUp className="text-text shrink-0" />
                    ) : (
                      <FiChevronDown className="text-text shrink-0" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedSections.includes(section._id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-1 mx-1 mb-2"
                      >
                        {lessons.map((lesson: any) => (
                          <button
                            key={lesson._id}
                            onClick={() => onLessonSelect(lesson)}
                            className={`w-full text-left p-3 rounded-lg transition-all ${
                              selectedLesson?._id === lesson._id
                                ? "bg-color-secondary text-white shadow-sm"
                                : "hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <span className="truncate text-sm text-text">
                                {lesson.title}
                              </span>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
