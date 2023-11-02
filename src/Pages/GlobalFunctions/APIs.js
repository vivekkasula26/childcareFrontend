const baseURL = "http://localhost:3000";

export const API_URLS = {
  ON_LOGIN: baseURL + "/check_login",
  ON_ADMIN_LOGIN: baseURL + "/check_admin_login",
  ENROLL_CHILD: baseURL + "/enroll_child",
  GET_ENROLLED_CHILDREN: baseURL + "/get_enrolled_students",
  HIRE_STAFF: baseURL + "/hire_staff",
  GET_HIRED_STAFF: baseURL + "/get_hired_staff",
  WITHDRAW_CHILD: baseURL + "/withdraw_child",
  WITHDRAW_STAFF: baseURL + "/withdraw_staff",
  GET_CLASSROOM_ENROLLMENTS: baseURL + "/get_classroom_enrollments",
};
