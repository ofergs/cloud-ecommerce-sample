import { Amplify } from 'aws-amplify';
import {
  signIn,
  signOut,
  signUp,
  confirmSignUp,
  fetchAuthSession,
  getCurrentUser,
} from '@aws-amplify/auth';

export function configureAmplify() {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID as string,
        userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID as string,
      },
    },
  });
}

export async function login(email: string, password: string) {
  return signIn({ username: email, password });
}

export async function register(email: string, password: string) {
  return signUp({ username: email, password, options: { userAttributes: { email } } });
}

export async function confirmRegistration(email: string, code: string) {
  return confirmSignUp({ username: email, confirmationCode: code });
}

export async function logout() {
  return signOut();
}

export async function getIdToken(): Promise<string | undefined> {
  const session = await fetchAuthSession();
  return session.tokens?.idToken?.toString();
}

export async function getCurrentUsername(): Promise<string | null> {
  try {
    const user = await getCurrentUser();
    return user.username;
  } catch {
    return null;
  }
}
