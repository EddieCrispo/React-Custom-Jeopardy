// Simple sound effects using Web Audio API
export const playSound = (type) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  
  const createTone = (frequency, duration, type = 'sine') => {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
    oscillator.type = type
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  }
  
  switch(type) {
    case 'correct':
      // Happy ascending chord
      createTone(523, 0.2) // C
      setTimeout(() => createTone(659, 0.2), 100) // E
      setTimeout(() => createTone(784, 0.3), 200) // G
      break
      
    case 'incorrect':
      // Very harsh buzzer sound
      createTone(80, 1.2, 'sawtooth')
      setTimeout(() => createTone(60, 0.8, 'square'), 200)
      break
      
    case 'click':
      // Quick click sound
      createTone(800, 0.1, 'square')
      break
      
    case 'reveal':
      // Mystery reveal sound
      createTone(200, 0.1)
      setTimeout(() => createTone(400, 0.1), 50)
      setTimeout(() => createTone(600, 0.2), 100)
      break
  }
}