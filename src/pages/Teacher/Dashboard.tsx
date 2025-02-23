import { useState } from "react";
import { CreateCourses } from "./CreateCoursePage";
import { ManageCourses } from "./ManageCoursesPage";
import { Course, NewCourse } from "../../types"; // ✅ Import both types

export default function TeacherDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showCreateCoursePage, setShowCreateCoursePage] = useState(false);

  const handleCreateCourse = (newCourse: NewCourse) => {
    const fullCourse: Course = {
      ...newCourse,
      isLocked: false, // ✅ Set default values
      enrolledStudents: [], // ✅ Initialize empty array
    };

    setCourses([...courses, fullCourse]);
    setShowCreateCoursePage(false);
  };

  if (showCreateCoursePage) {
    return (
      <CreateCourses
        onSubmit={handleCreateCourse} // ✅ Now correctly typed
        onCancel={() => setShowCreateCoursePage(false)}
      />
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 dark:text-gray-100 p-8">
      <button
        onClick={() => setShowCreateCoursePage(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        Create Course
      </button>
      <ManageCourses courses={courses} setCourses={setCourses} />
    </div>
  );
}
