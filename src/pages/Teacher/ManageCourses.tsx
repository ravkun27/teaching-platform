import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { useCourses } from "../../context/CourseContext";
import { Content, Section, Course, ContentType } from "../../types";
import { FaEdit, FaTrash, FaChevronDown } from "react-icons/fa";

const ManageCourses = () => {
  const { courses, dispatch } = useCourses();
  const [newCourse, setNewCourse] = useState<Partial<Course>>({});
  const [newSection, setNewSection] = useState("");
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [addingContent, setAddingContent] = useState<{
    courseId: string;
    sectionId: string;
    type: ContentType | null;
  } | null>(null);
  const [contentDetails, setContentDetails] = useState({
    name: "",
    description: "",
    file: null as File | null,
  });
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(
    new Set()
  );
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);

  const toggleCourse = (courseId: string) => {
    setExpandedCourses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const createCourse = () => {
    if (!newCourse.title || !newCourse.description || !newCourse.banner) return;

    const course: Course = {
      id: uuidv4(),
      title: newCourse.title,
      description: newCourse.description,
      banner: newCourse.banner,
      sections: [],
      isPublished: false,
      createdAt: new Date(),
    };
    dispatch({ type: "CREATE_COURSE", payload: course });
    setShowCourseForm(false);
    setNewCourse({});
  };

  const addSection = (courseId: string) => {
    if (!newSection.trim()) return;

    const section: Section = {
      id: uuidv4(),
      name: newSection,
      contents: [],
    };
    dispatch({ type: "ADD_SECTION", payload: { courseId, section } });
    setNewSection("");
  };

  const handleAddContent = () => {
    if (!addingContent || !contentDetails.name.trim()) return;

    const content: Content = {
      id: uuidv4(),
      type: addingContent.type!,
      name: contentDetails.name,
      description: contentDetails.description,
      fileUrl: contentDetails.file
        ? URL.createObjectURL(contentDetails.file)
        : null,
      createdAt: new Date(),
    };

    dispatch({
      type: "ADD_CONTENT",
      payload: {
        courseId: addingContent.courseId,
        sectionId: addingContent.sectionId,
        content,
      },
    });
    setAddingContent(null);
    setContentDetails({ name: "", description: "", file: null });
  };

  const deleteSection = (courseId: string, sectionId: string) => {
    dispatch({
      type: "DELETE_SECTION",
      payload: { courseId, sectionId },
    });
  };

  const deleteContent = (
    courseId: string,
    sectionId: string,
    contentId: string
  ) => {
    dispatch({
      type: "DELETE_CONTENT",
      payload: { courseId, sectionId, contentId },
    });
  };

  const editSectionName = (
    courseId: string,
    sectionId: string,
    newName: string
  ) => {
    dispatch({
      type: "EDIT_SECTION_NAME",
      payload: { courseId, sectionId, newName },
    });
    setEditingSectionId(null);
  };

  const editContentName = (
    courseId: string,
    sectionId: string,
    contentId: string,
    newName: string
  ) => {
    dispatch({
      type: "EDIT_CONTENT_NAME",
      payload: { courseId, sectionId, contentId, newName },
    });
    setEditingContentId(null);
  };

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Courses</h1>
        <button
          onClick={() => setShowCourseForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
        >
          Create New Course
        </button>
      </div>

      <AnimatePresence>
        {showCourseForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-background-dark rounded-xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4">Create Course</h2>
              <input
                type="text"
                placeholder="Course Title"
                className="w-full mb-4 p-2 border rounded-lg"
                onChange={(e) =>
                  setNewCourse({ ...newCourse, title: e.target.value })
                }
              />
              <textarea
                placeholder="Description"
                className="w-full mb-4 p-2 border rounded-lg"
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Banner Image URL"
                className="w-full mb-4 p-2 border rounded-lg"
                onChange={(e) =>
                  setNewCourse({ ...newCourse, banner: e.target.value })
                }
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={createCourse}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCourseForm(false)}
                  className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {addingContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-background-dark rounded-xl p-6 w-full max-w-md"
            >
              <h2 className="text-lg font-semibold mb-4">
                Add {addingContent.type}
              </h2>
              <input
                type="text"
                placeholder="Content Name"
                className="w-full mb-4 p-2 border rounded-lg"
                value={contentDetails.name}
                onChange={(e) =>
                  setContentDetails({ ...contentDetails, name: e.target.value })
                }
              />
              <textarea
                placeholder="Description"
                className="w-full mb-4 p-2 border rounded-lg"
                value={contentDetails.description}
                onChange={(e) =>
                  setContentDetails({
                    ...contentDetails,
                    description: e.target.value,
                  })
                }
              />
              <input
                type="file"
                className="w-full mb-4 p-2 border rounded-lg"
                onChange={(e) =>
                  setContentDetails({
                    ...contentDetails,
                    file: e.target.files?.[0] || null,
                  })
                }
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleAddContent}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => setAddingContent(null)}
                  className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <AnimatePresence>
          {courses.map((course: Course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeInOut" }} // Adjust transition timing
              className="bg-white rounded-xl shadow-sm p-4 duration-700"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleCourse(course.id)}
              >
                <div className="flex gap-4 w-full justify-between">
                  <div className="flex gap-4">
                    {course.banner && (
                      <img
                        src={course.banner}
                        alt="Course banner"
                        className="mt-2 h-12 w-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h2 className="text-2xl font-semibold">{course.title}</h2>
                      <p>{course.description}</p>
                    </div>
                  </div>
                  {!expandedCourses.has(course.id) && (
                    <div className="group opacity-0 hover:opacity-100 flex gap-4 items-center justify-center pr-5 transition-opacity duration-300">
                      <p>Add Video</p>
                      <p>Add Quiz</p>
                      <p>Add Lecture</p>
                    </div>
                  )}
                </div>
                <motion.div
                  animate={{
                    rotate: expandedCourses.has(course.id) ? 180 : 0,
                  }}
                >
                  <FaChevronDown />
                </motion.div>
              </div>

              <AnimatePresence>
                {expandedCourses.has(course.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }} // Adjust transition timing
                    className="mt-4 space-y-4"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="New Section Name"
                        className="flex-1 p-2 border rounded-lg"
                        value={newSection}
                        onChange={(e) => setNewSection(e.target.value)}
                      />
                      <button
                        onClick={() => addSection(course.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Add Section
                      </button>
                    </div>

                    <div className="space-y-4">
                      {course.sections.map((section) => (
                        <div
                          key={section.id}
                          className="bg-gray-50 p-4 rounded-lg"
                        >
                          <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection(section.id)}
                          >
                            <div className="flex items-center gap-2">
                              {editingSectionId === section.id ? (
                                <input
                                  type="text"
                                  defaultValue={section.name}
                                  onBlur={(e) =>
                                    editSectionName(
                                      course.id,
                                      section.id,
                                      e.target.value
                                    )
                                  }
                                  className="p-1 border rounded"
                                />
                              ) : (
                                <h3 className="font-medium">{section.name}</h3>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingSectionId(section.id);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <FaEdit />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteSection(course.id, section.id);
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTrash />
                              </button>
                              <motion.div
                                animate={{
                                  rotate: expandedSections.has(section.id)
                                    ? 180
                                    : 0,
                                }}
                              >
                                <FaChevronDown />
                              </motion.div>
                            </div>
                          </div>
                          <AnimatePresence>
                            {expandedSections.has(section.id) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{
                                  duration: 0.2,
                                  ease: "easeInOut",
                                }} // Adjust transition timing
                                className="mt-4 space-y-2"
                              >
                                <div className="flex gap-2 mb-4">
                                  {(
                                    [
                                      "video",
                                      "quiz",
                                      "lecture",
                                    ] as ContentType[]
                                  ).map((type) => (
                                    <button
                                      key={type}
                                      onClick={() =>
                                        setAddingContent({
                                          courseId: course.id,
                                          sectionId: section.id,
                                          type,
                                        })
                                      }
                                      className="bg-green-500 text-white px-3 py-1.5 rounded-md text-sm capitalize hover:bg-green-600 transition-colors"
                                    >
                                      Add {type}
                                    </button>
                                  ))}
                                </div>
                                <div className="space-y-2">
                                  {section.contents.map((content) => (
                                    <motion.div
                                      key={content.id}
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{
                                        duration: 0.5,
                                        ease: "easeInOut",
                                      }} // Adjust transition timing
                                      className="bg-white p-3 rounded-lg shadow-xs"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span
                                          className={`inline-block w-2 h-2 rounded-full 
                                          ${
                                            content.type === "video"
                                              ? "bg-red-500"
                                              : content.type === "quiz"
                                              ? "bg-blue-500"
                                              : "bg-green-500"
                                          }`}
                                        />
                                        <div>
                                          {editingContentId === content.id ? (
                                            <input
                                              type="text"
                                              defaultValue={content.name}
                                              onBlur={(e) =>
                                                editContentName(
                                                  course.id,
                                                  section.id,
                                                  content.id,
                                                  e.target.value
                                                )
                                              }
                                              className="p-1 border rounded"
                                            />
                                          ) : (
                                            <p className="font-medium">
                                              {content.name}
                                            </p>
                                          )}
                                          <p className="text-sm text-gray-600">
                                            {content.description}
                                          </p>
                                          {content.fileUrl && (
                                            <a
                                              href={content.fileUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-blue-500 hover:underline"
                                            >
                                              View File
                                            </a>
                                          )}
                                        </div>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingContentId(content.id);
                                          }}
                                          className="text-gray-500 hover:text-gray-700"
                                        >
                                          <FaEdit />
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            deleteContent(
                                              course.id,
                                              section.id,
                                              content.id
                                            );
                                          }}
                                          className="text-red-500 hover:text-red-700"
                                        >
                                          <FaTrash />
                                        </button>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                            <div className="pt-6">
                              <button
                                onClick={() =>
                                  dispatch({
                                    type: "PUBLISH_COURSE",
                                    payload: course.id,
                                  })
                                }
                                className={`px-6 py-2 text-xl rounded-lg transition-colors ${
                                  course.isPublished ||
                                  !course.sections.length ||
                                  course.sections.some(
                                    (s) => !s.contents.length
                                  )
                                    ? "bg-gray-200 cursor-not-allowed"
                                    : "bg-purple-500 hover:bg-purple-600 text-white"
                                }`}
                                disabled={
                                  course.isPublished ||
                                  !course.sections.length ||
                                  course.sections.some(
                                    (s) => !s.contents.length
                                  )
                                }
                              >
                                {course.isPublished ? "Published" : "Publish"}
                              </button>
                            </div>
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ManageCourses;
