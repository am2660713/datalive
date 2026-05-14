const getManagerEmails = () =>
  (process.env.MANAGER_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

const getAdminEmails = () =>
  (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

export const isApprovedAdminEmail = (email) => {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
};

export const isApprovedManagerEmail = (email) => {
  if (!email) return false;
  return getManagerEmails().includes(email.toLowerCase());
};

export const getEffectiveRole = (user) => {
  if (isApprovedAdminEmail(user?.email)) {
    return "admin";
  }

  if (isApprovedManagerEmail(user?.email)) {
    return "manager";
  }

  return "employee";
};
