export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
};

export const isValidPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 13;
};

export const formatApiResponse = <T>(success: boolean, message: string, data: T | null = null, errors: any[] = []) => {
  return {
    success,
    message,
    data,
    errors,
  };
};
