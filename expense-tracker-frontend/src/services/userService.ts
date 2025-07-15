const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const createUser = async (userData: string) => {
  const parsedData = JSON.parse(userData);
  
  const response = await fetch(`${API_BASE_URL}/api/users/createUser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: parsedData.userId,
      firstName: parsedData.firstName,
      lastName: parsedData.lastName,
      email: parsedData.email
    })
  });

  if (!response.ok) {
    throw new Error('Failed to create user in database');
  }

  return response.json();
};

export const getUserProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/getProfile`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to get user profile');
  }
  
  return response.json();
};

export const updateUserProfile = async (userData: string) => {
  const parsedData = JSON.parse(userData);
  
  const response = await fetch(`${API_BASE_URL}/api/users/updateProfile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      firstName: parsedData.firstName,
      lastName: parsedData.lastName,
      email: parsedData.email
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to update user profile');
  }
  
  return response.json();
};

export const deleteUserProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/deleteProfile`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to delete user profile');
  }

  return response.json();
};
