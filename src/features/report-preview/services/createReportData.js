export const createReportData = ({ cities, tehran }) => {
  if (!cities || !tehran) {
    throw new Error('Both parsed datasets are required to create a report.')
  }

  return {
    datasets: {
      cities,
      tehran,
    },
    cover: {
      greeting: 'سلام',
    },
  }
}
