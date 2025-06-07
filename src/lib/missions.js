// In-memory storage (replace with real database in production)
const missions = []
let errorLogs = []

function getMissions(userId) {
  return missions.filter((mission) => mission.userId === userId)
}

function getMissionById(id, userId) {
  return missions.find((mission) => mission.id === id && mission.userId === userId)
}

function createMission(title, description, userId) {
  const mission = {
    id: Math.random().toString(36).substr(2, 9),
    title,
    description,
    status: "active",
    createdAt: new Date(),
    userId,
  }
  missions.push(mission)
  return mission
}

function updateMissionStatus(id, status, userId) {
  const mission = missions.find((m) => m.id === id && m.userId === userId)
  if (mission) {
    mission.status = status
    return true
  }
  return false
}

function deleteMission(id, userId) {
  const index = missions.findIndex((m) => m.id === id && m.userId === userId)
  if (index !== -1) {
    missions.splice(index, 1)
    // Also delete related error logs
    errorLogs = errorLogs.filter((log) => log.missionId !== id)
    return true
  }
  return false
}

function startTimer(missionId, userId) {
  const mission = missions.find((m) => m.id === missionId && m.userId === userId)
  if (mission && (!mission.timer || !mission.timer.startTime)) {
    mission.timer = { startTime: new Date() }
    return true
  }
  return false
}

function stopTimer(missionId, userId) {
  const mission = missions.find((m) => m.id === missionId && m.userId === userId)
  if (mission && mission.timer?.startTime && !mission.timer.endTime) {
    const endTime = new Date()
    const duration = Math.floor((endTime - mission.timer.startTime) / 1000)
    mission.timer.endTime = endTime
    mission.timer.duration = duration
    return true
  }
  return false
}

function getErrorLogs(missionId) {
  return errorLogs.filter((log) => log.missionId === missionId)
}

function addErrorLog(missionId, message) {
  const errorLog = {
    id: Math.random().toString(36).substr(2, 9),
    missionId,
    message,
    timestamp: new Date(),
  }
  errorLogs.push(errorLog)
  return errorLog
}

export {
  getMissions,
  getMissionById,
  createMission,
  updateMissionStatus,
  deleteMission,
  startTimer,
  stopTimer,
  getErrorLogs,
  addErrorLog,
}
