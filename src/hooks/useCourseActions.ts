import { useCourses } from "../context/CourseContext";
import { getFetch } from "../utils/apiCall";

export const useCourseActions = () => {
  const { dispatch } = useCourses(); // ✅ Now inside a hook

  const getCourseList = async () => {
    try {
      const courseResult: any = await getFetch("/user/teacher/course/all");
      dispatch({
        type: "SET_COURSE",
        payload: courseResult?.data?.courseList || [],
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  return { getCourseList };
};
