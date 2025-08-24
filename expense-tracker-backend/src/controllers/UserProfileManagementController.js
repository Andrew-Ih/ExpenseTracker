import UserModel from '../models/user.js';
import CognitoService from '../services/cognitoService.js'; 

class UserProfileManagementController {
  static async createUserProfile(req, res) {
    try {
      const { firstName, lastName, email, userId } = req.body;
      
      if (!firstName || !email || !userId) {
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
        lastName: lastName || '', 
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

  static async updateUserProfile(req, res) {
    try {
      const userId = req.user.userId; // From JWT middleware
      const { firstName, lastName } = req.body;
      const accessToken = req.headers.authorization.replace('Bearer ', '');

      if (!firstName && !lastName ) {
        return res.status(400).json({ error: 'At least one field must be provided for update' });
      }

      // Update both DynamoDB and Cognito
      const [updatedUser] = await Promise.all([
        UserModel.updateById(userId, { firstName, lastName }),
        CognitoService.updateUserAttributes(accessToken, firstName, lastName)
      ]);

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Failed to update user profile' });
    }
  }

  static async deleteUserProfile(req, res) {
    try {
      const userId = req.user.userId; // From JWT middleware
      const accessToken = req.headers.authorization.replace('Bearer ', '');

      // Delete from both DynamoDB and Cognito
      const [deletedUser] = await Promise.all([
        UserModel.deleteById(userId),
        CognitoService.deleteUser(accessToken)
      ]);

      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
}

export default UserProfileManagementController;
