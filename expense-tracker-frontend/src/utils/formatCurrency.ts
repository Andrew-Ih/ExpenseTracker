export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const getMonthDateRange = (yearMonth: string) => {
  const [year, month] = yearMonth.split('-');
  const startDate = `${yearMonth}-01`;
  const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
  const endDate = `${yearMonth}-${lastDay.toString().padStart(2, '0')}`;
  return { startDate, endDate };
};
