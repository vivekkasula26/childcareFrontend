const baseURL = "https://34.171.50.246:443";

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
  ENROLL_CHILD_TO_WAITLIST: baseURL + "/enroll_child_waitlist",
  GET_WAIT_CHILD_LIST: baseURL + "/get_waitlist_students",
  UPDATE_STAFF: baseURL + "/update_staff",
  GET_AVALIABLE_CLASSROOM_SPOTS: baseURL + "/get_available_classrom_spots",
  GET_STUDENT_LEDGER: baseURL + "/get_student_ledger",
  CREATE_ACCOUNT: baseURL + "/create_account",
  SIGN_OUT: baseURL + "/sign_out",
  GET_STAFF_ATTENDANCE: baseURL + "/get_staff_attendance",
  GET_STAFF_ATTENDANCE_BY_ID: baseURL + "/get_staff_attendance_by_id",
  GET_STAFF_PERSONAL_INFORMATION: baseURL + "/get_staff_personal_information",
  GET_ASSIGNED_ENROLLED_CHILDREN: baseURL + "/get_assigned_enrolled_children",
  MARK_CHILD_LOGIN: baseURL + "/mark_child_login",
  MARK_CHILD_LOGOUT: baseURL + "/mark_child_logout",
  GET_CHILD_ATTENDANCE: baseURL + "/get_child_attendance",
  GET_LEDGER_REPORT: baseURL + "/get_ledger_report",
  INVITE_PARENT: baseURL + "/invite_parent",
  MAKE_PAYMENT: baseURL + "/make_payment",
  INVITE_STAFF: baseURL + "/invite_staff",
  CREATE_FACILITY_ACCOUNT: baseURL + "/create_facility_account",
  GET_FACILITY_INFORMATION: baseURL + "/get_facility_information",
  UPDATE_CHILD_DETAILS: baseURL + "/update_child_information",
};
