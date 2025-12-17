export const requestDelay = (ms = 400) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const withDelay = async (data, ms = 400) => {
  await requestDelay(ms);
  return data;
};

export default requestDelay;
