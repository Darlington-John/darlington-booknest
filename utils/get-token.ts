
export const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('User is not authenticated');
      return null;
    }
    return token;
  };
  