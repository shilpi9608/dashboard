"use client"
import React, { createContext, useContext, useState } from 'react';

const MissionContext = createContext();

export const useMissions = () => {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMissions must be used within a MissionProvider');
  }
  return context;
};

export const MissionProvider = ({ children }) => {
  const [missions, setMissions] = useState([
    {
      id: '1',
      title: 'Mars Rover Exploration',
      description: 'Deploy and operate the new Mars rover for geological sample collection and analysis.',
      status: 'active',
      createdAt: new Date('2024-01-15T10:30:00'),
      errors: [
        { id: '1', message: 'Communication delay detected', timestamp: new Date('2024-01-16T14:20:00') },
        { id: '2', message: 'Wheel alignment calibration required', timestamp: new Date('2024-01-17T09:15:00') }
      ],
      timer: null
    },
    {
      id: '2',
      title: 'ISS Supply Mission',
      description: 'Coordinate supply delivery to the International Space Station including food, water, and equipment.',
      status: 'completed',
      createdAt: new Date('2024-01-10T08:00:00'),
      errors: [],
      timer: { startTime: new Date('2024-01-10T08:00:00'), endTime: new Date('2024-01-12T16:30:00') }
    }
  ]);

  const createMission = (missionData) => {
    const newMission = {
      id: Date.now().toString(),
      ...missionData,
      status: 'active',
      createdAt: new Date(),
      errors: [],
      timer: null
    };
    setMissions(prev => [newMission, ...prev]);
    return newMission;
  };

  const updateMission = (id, updates) => {
    setMissions(prev => prev.map(mission => 
      mission.id === id ? { ...mission, ...updates } : mission
    ));
  };

  const deleteMission = (id) => {
    setMissions(prev => prev.filter(mission => mission.id !== id));
  };

  const addError = (missionId, errorMessage) => {
    const newError = {
      id: Date.now().toString(),
      message: errorMessage,
      timestamp: new Date()
    };
    
    setMissions(prev => prev.map(mission => 
      mission.id === missionId 
        ? { ...mission, errors: [...mission.errors, newError] }
        : mission
    ));
  };

  const startTimer = (missionId) => {
    const timer = {
      startTime: new Date(),
      endTime: null
    };
    
    updateMission(missionId, { timer });
  };

  const stopTimer = (missionId) => {
    setMissions(prev => prev.map(mission => 
      mission.id === missionId && mission.timer
        ? { ...mission, timer: { ...mission.timer, endTime: new Date() } }
        : mission
    ));
  };

  return (
    <MissionContext.Provider value={{
      missions,
      createMission,
      updateMission,
      deleteMission,
      addError,
      startTimer,
      stopTimer
    }}>
      {children}
    </MissionContext.Provider>
  );
};