const ROLES = Object.freeze({
  ADMIN: "Admin",
  HR: "HR Manager",
  EMPLOYEE: "Employee"
});

const LEAVE_TYPES = Object.freeze(["Casual", "Sick", "Paid"]);
const LEAVE_STATUS = Object.freeze(["Pending", "Approved", "Rejected"]);

module.exports = { ROLES, LEAVE_TYPES, LEAVE_STATUS };
