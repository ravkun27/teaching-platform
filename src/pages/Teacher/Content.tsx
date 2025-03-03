import { deleteFetch, getFetch, putFetch } from "../../utils/apiCall";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuVideo,
  LuBook,
  LuClipboardList,
  LuFile,
  LuPencil,
  LuCheck,
  LuTrash2,
  LuX,
} from "react-icons/lu";

import { useEffect, useState } from "react";
import { useCourseActions } from "../../hooks/useCourseActions";
import { removeNullAndUndefinedFields } from "../../utils/utilsMethod/removeNullFiled";
import { useCourses } from "../../context/CourseContext";
import { MediaModal } from "../../components/Modal/MediaModal";
import toast from "react-hot-toast";
import { ContentTypeOption } from "../../types";
import { ConfirmationModal } from "../../components/Modal/ConfiramtionModal";

export const Content = ({
  sectionId,
  courseId,
  contentId,
}: {
  sectionId: any;
  courseId: any;
  contentId: any;
}) => {
  const { setCourseList } = useCourseActions();
  const { courses } = useCourses();
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [content, setContent] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tempContentData, setTempContentData] = useState({
    title: "",
    description: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (content) {
      setTempContentData({
        title: content.title || "",
        description: content.description || "",
      });
    }
  }, [content]);

  const deleteContent = async () => {
    try {
      const result: any = await deleteFetch(
        `/user/teacher/course/lesson?lessonId=${contentId}&courseId=${courseId}&sectionId=${sectionId}`
      );
      if (result.success) {
        setCourseList();
        toast.success("Content deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete content");
      console.error("Error deleting content:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const editContentName = async () => {
    try {
      const result: any = await putFetch(
        `/user/teacher/course/lesson?lessonId=${contentId}&courseId=${courseId}`,
        { ...removeNullAndUndefinedFields(tempContentData) }
      );
      if (result.success) {
        setCourseList();
        toast.success("Content updated successfully");
        setEditingContentId(null);
      }
    } catch (error) {
      toast.error("Failed to update content");
      console.error("Error updating content:", error);
    }
  };

  const getContent = async () => {
    try {
      const content: any = await getFetch(
        `/user/teacher/course/lesson?lessonId=${contentId}&courseId=${courseId}`
      );
      setContent(content?.lesson);
    } catch (error) {
      toast.error("Failed to load content");
      console.error("Error fetching content:", error);
    }
  };

  useEffect(() => {
    getContent();
  }, [courses]);

  return (
    <>
      {showDeleteConfirm && (
        <ConfirmationModal
          message="Are you sure you want to delete this content?"
          onConfirm={() => {
            deleteContent();
            setShowDeleteConfirm(false);
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      <MediaModal
        url={content?.filePath}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        contentType={content?.fileType}
        title={content?.title}
      />

      <AnimatePresence>
        {!content ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-12 bg-gray-100 rounded-lg animate-pulse"
          />
        ) : (
          <motion.div
            key={content._id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="group bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div
                  className={`p-3 rounded-xl ${
                    {
                      video:
                        "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300",
                      quiz: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300",
                      lecture:
                        "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300",
                    }[content.type as ContentTypeOption]
                  }`}
                >
                  {
                    {
                      video: <LuVideo size={24} />,
                      quiz: <LuClipboardList size={24} />,
                      lecture: <LuBook size={24} />,
                    }[content.type as ContentTypeOption]
                  }
                </div>

                <div className="flex-1 min-w-0">
                  {editingContentId === content._id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={tempContentData.title}
                        onChange={(e) =>
                          setTempContentData({
                            ...tempContentData,
                            title: e.target.value,
                          })
                        }
                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <textarea
                        value={tempContentData.description}
                        onChange={(e) =>
                          setTempContentData({
                            ...tempContentData,
                            description: e.target.value,
                          })
                        }
                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 h-32"
                      />
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={editContentName}
                          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 text-sm"
                        >
                          <LuCheck size={20} />
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingContentId(null)}
                          className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                        >
                          <LuX size={20} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        {content.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {content.description}
                      </p>
                      {content.filePath && (
                        <button
                          onClick={() => setIsOpen(true)}
                          className="mt-3 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                        >
                          <LuFile size={18} />
                          <span className="font-medium">View Attachment</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingContentId(content._id)}
                  className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-400"
                >
                  <LuPencil size={22} />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                  className="p-2.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl text-red-500"
                >
                  <LuTrash2 size={22} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
