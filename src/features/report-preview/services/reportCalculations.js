export const calculateGrowthPercent = (current, previous) => {
  if (
    !Number.isFinite(current) ||
    !Number.isFinite(previous) ||
    previous <= 0
  ) {
    return null
  }

  return ((current - previous) / previous) * 100
}

export const calculatePercentagePointChange = (current, previous) => {
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return null

  return (current - previous) * 100
}
