class UserService {
  constructor() {
    // Initialize ApperClient for user operations
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async login(email, password) {
    try {
      // Query user table using ApperClient
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email_c" } },
          { field: { Name: "password_c" } },
          { field: { Name: "role_c" } }
        ],
        where: [
          {
            FieldName: "email_c",
            Operator: "EqualTo",
            Values: [email]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('user_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error('Login failed');
      }

      const users = response.data || [];
      const user = users.find(u => u.email_c === email && u.password_c === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Return user without password
      const { password_c: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error in user login:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async logout() {
    try {
      // Handle logout through ApperUI
      const { ApperUI } = window.ApperSDK;
      await ApperUI.logout();
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error.message);
      throw error;
    }
  }
}

export const userService = new UserService();
export default userService;