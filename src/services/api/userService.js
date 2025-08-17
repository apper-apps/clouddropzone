import usersData from '../mockData/users.json';

class UserService {
  constructor() {
    this.users = [...usersData];
  }

  async login(email, password) {
    // Simulate API delay
    await this.delay(800);

    const user = this.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async logout() {
    // Simulate API delay
    await this.delay(300);
    return { success: true };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const userService = new UserService();
export default userService;