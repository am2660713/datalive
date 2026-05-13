const getManagerEmails = () =>
  (process.env.MANAGER_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

export const isApprovedManagerEmail = (email) => {
  if (!email) return false;
  return getManagerEmails().includes(email.toLowerCase());
};

export const getEffectiveRole = (user) => {
  if (user?.role === "manager" && isApprovedManagerEmail(user.email)) {
    return "manager";
  }

  return "employee";
};
