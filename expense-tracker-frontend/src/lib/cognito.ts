import { 
  CognitoIdentityProviderClient, 
  SignUpCommand, 
  ConfirmSignUpCommand, 
  InitiateAuthCommand, 
  ResendConfirmationCodeCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand 
} from '@aws-sdk/client-cognito-identity-provider';
import { AWS_CONFIG } from './aws-config';

const client = new CognitoIdentityProviderClient({ region: AWS_CONFIG.region });

export const signUp = async (email: string, password: string, fullName: string) => {
  const command = new SignUpCommand({
    ClientId: AWS_CONFIG.userPoolWebClientId,
    Username: email,
    Password: password,
    UserAttributes: [
      { Name: 'email', Value: email },
      { Name: 'name', Value: fullName }
    ]
  });
  const result = await client.send(command);
  return { userSub: result.UserSub };
};

export const confirmSignUp = async (email: string, code: string) => {
  const command = new ConfirmSignUpCommand({
    ClientId: AWS_CONFIG.userPoolWebClientId,
    Username: email,
    ConfirmationCode: code
  });
  return await client.send(command);
};

export const signIn = async (email: string, password: string) => {
  const command = new InitiateAuthCommand({
    ClientId: AWS_CONFIG.userPoolWebClientId,
    AuthFlow: 'USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password
    }
  });
  return await client.send(command);
};

export const resendConfirmationCode = async (email: string) => {
  const command = new ResendConfirmationCodeCommand({
    ClientId: AWS_CONFIG.userPoolWebClientId,
    Username: email
  });
  return await client.send(command);
};

export const forgotPassword = async (email: string) => {
  const command = new ForgotPasswordCommand({
    ClientId: AWS_CONFIG.userPoolWebClientId,
    Username: email
  });
  return await client.send(command);
};

export const confirmForgotPassword = async (email: string, code: string, newPassword: string) => {
  const command = new ConfirmForgotPasswordCommand({
    ClientId: AWS_CONFIG.userPoolWebClientId,
    Username: email,
    ConfirmationCode: code,
    Password: newPassword
  });
  return await client.send(command);
};
