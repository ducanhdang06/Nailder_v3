// Purpose: Centralizes navigation logic based on user roles
// Responsibilities:

// Determines correct home screen based on user role
// Handles role-based routing logic
// Provides consistent navigation patterns

export const navigationService = {
    navigateByRole(navigation, role) {
      if (role === "technician" || role === "Technician") {
        navigation.replace("TechnicianHome");
      } else if (role === "customer" || role === "Customer") {
        navigation.replace("CustomerHome");
      } else {
        console.warn("Unknown role:", role);
      }
    },
  };