export const setLocalStroage = (user: any) => {
  localStorage.setItem('user', JSON.stringify(user) || '');
};

export const getLocalStroage = () => {
  const obj = JSON.parse(localStorage.getItem('user') as string);
  return {
    ...obj,
  };
};
