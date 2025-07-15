import CognitoService from '../services/cognitoService.js';

class AuthController {
  static async signUp(req, res) {
    try {
      const { email, password, fullName } = req.body;
      
      if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'All fields required' });
      }

      const result = await CognitoService.signUp(email, password, fullName);
      
      res.status(201).json({
        message: 'User registered successfully',
        userSub: result.userSub
      });
    } catch (error) {
      console.error('SignUp error:', error);
      res.status(400).json({ error: error.message || 'Registration failed' });
    }
  }

  static async confirmSignUp(req, res) {
    try {
      const { email, code } = req.body;
      
      if (!email || !code) {
        return res.status(400).json({ error: 'Email and code required' });
      }

      await CognitoService.confirmSignUp(email, code);
      
      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      console.error('ConfirmSignUp error:', error);
      res.status(400).json({ error: error.message || 'Verification failed' });
    }
  }

  static async signIn(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const result = await CognitoService.signIn(email, password);
      
      res.json({
        message: 'Login successful',
        accessToken: result.AuthenticationResult?.AccessToken,
        refreshToken: result.AuthenticationResult?.RefreshToken,
        idToken: result.AuthenticationResult?.IdToken
      });
    } catch (error) {
      console.error('SignIn error:', error);
      res.status(401).json({ error: error.message || 'Login failed' });
    }
  }

  static async resendConfirmationCode(req, res) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email required' });
      }

      await CognitoService.resendConfirmationCode(email);
      
      res.json({ message: 'Confirmation code sent' });
    } catch (error) {
      console.error('ResendCode error:', error);
      res.status(400).json({ error: error.message || 'Failed to resend code' });
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email required' });
      }

      await CognitoService.forgotPassword(email);
      
      res.json({ message: 'Reset code sent to email' });
    } catch (error) {
      console.error('ForgotPassword error:', error);
      res.status(400).json({ error: error.message || 'Failed to send reset code' });
    }
  }

  static async confirmForgotPassword(req, res) {
    try {
      const { email, code, newPassword } = req.body;
      
      if (!email || !code || !newPassword) {
        return res.status(400).json({ error: 'Email, code, and new password required' });
      }

      await CognitoService.confirmForgotPassword(email, code, newPassword);
      
      res.json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('ConfirmForgotPassword error:', error);
      res.status(400).json({ error: error.message || 'Password reset failed' });
    }
  }
}

export default AuthController;
