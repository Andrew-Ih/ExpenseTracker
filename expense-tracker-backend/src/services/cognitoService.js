import { 
  CognitoIdentityProviderClient, 
  SignUpCommand, 
  ConfirmSignUpCommand, 
  InitiateAuthCommand, 
  ResendConfirmationCodeCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  UpdateUserAttributesCommand,
  DeleteUserCommand
} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({ region: 'ca-central-1' });
const USER_POOL_CLIENT_ID = process.env.COGNITO_USER_POOL_CLIENT_ID;

class CognitoService {
  static async signUp(email, password, fullName) {
    const command = new SignUpCommand({
      ClientId: USER_POOL_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: fullName }
      ]
    });
    const result = await client.send(command);
    return { userSub: result.UserSub };
  }

  static async confirmSignUp(email, code) {
    const command = new ConfirmSignUpCommand({
      ClientId: USER_POOL_CLIENT_ID,
      Username: email,
      ConfirmationCode: code
    });
    return await client.send(command);
  }

  static async signIn(email, password) {
    const command = new InitiateAuthCommand({
      ClientId: USER_POOL_CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    });
    return await client.send(command);
  }

  static async resendConfirmationCode(email) {
    const command = new ResendConfirmationCodeCommand({
      ClientId: USER_POOL_CLIENT_ID,
      Username: email
    });
    return await client.send(command);
  }

  static async forgotPassword(email) {
    const command = new ForgotPasswordCommand({
      ClientId: USER_POOL_CLIENT_ID,
      Username: email
    });
    return await client.send(command);
  }

  static async confirmForgotPassword(email, code, newPassword) {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: USER_POOL_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword
    });
    return await client.send(command);
  }

  static async updateUserAttributes(accessToken, firstName, lastName) {
    const fullName = `${firstName} ${lastName}`.trim();
    
    const command = new UpdateUserAttributesCommand({
      AccessToken: accessToken,
      UserAttributes: [
        { Name: 'name', Value: fullName }
      ]
    });
    return await client.send(command);
  }

  static async deleteUser(accessToken) {
    const command = new DeleteUserCommand({
      AccessToken: accessToken
    });
    return await client.send(command);
  }
}

export default CognitoService;
