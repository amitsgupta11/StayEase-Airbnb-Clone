export const differenceInDays = (dateA, dateB) => {
  const ms = Math.abs(new Date(dateA) - new Date(dateB));
  return Math.ceil(ms / (1000*60*60*24));
};
