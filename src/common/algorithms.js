// @TODO move
export const uniteMissionsDates = (missions) => {
  const union = []

  missions.forEach(mission => {
    Object.keys(mission.dates).forEach(date => {
      union.push({
        name: mission.name,
        shortname: mission.shortname,
        date: date,
        content: mission.dates[date]
      })
    })
  })

  return union;
}

export const sortMissionsDates = (dates) => {
  return dates.sort((a, b) => new Date(a.date) - new Date(b.date));
}

export const aggregateMissionsDates = (missions) => {
  return sortMissionsDates(uniteMissionsDates(missions));
}