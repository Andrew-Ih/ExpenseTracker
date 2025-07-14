import UserModel from '../models/user.js';

class UserController {
  static async createUser(req, res) {
    try {
      const { firstName, lastName, email, userId } = req.body;
      
      if (!firstName || !lastName || !email || !userId) {
        return res.status(400).json({ 
          error: 'All fields required',
          received: {
            firstName: firstName || 'missing',
            lastName: lastName || 'missing', 
            email: email || 'missing',
            userId: userId || 'missing'
          },
          body: req.body
        });
      }

      const user = await UserModel.create({
        userId,
        firstName,
        lastName,
        email
      });

      res.status(200).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  }

  static async getUserProfile(req, res) {
    try {
      const userId = req.user.userId; // From JWT middleware
      const user = await UserModel.getById(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Error getting user profile:', error);
      res.status(500).json({ error: 'Failed to get user profile' });
    }
  }
}

export default UserController;
