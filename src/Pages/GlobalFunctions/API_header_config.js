export const getHeaderConfig = (user = {}) => {
  let header = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  };
  if (user && user.email) {
    (header["email"] = user.email), (header["role"] = user.role);
  }

  let head = { headers: header };
  return head;
};
