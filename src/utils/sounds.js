// Shared AudioContext for efficiency
let audioContext = null
let currentTimerSource = null

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

export const playSound = (type) => {
  const ctx = getAudioContext()
  
  const createTone = (frequency, duration, toneType = 'sine', startTime = ctx.currentTime) => {
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.setValueAtTime(frequency, startTime)
    oscillator.type = toneType
    
    gainNode.gain.setValueAtTime(0.3, startTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
    
    oscillator.start(startTime)
    oscillator.stop(startTime + duration)
    return oscillator
  }
  
  switch(type) {
    case 'correct':
      createTone(523, 0.2)
      setTimeout(() => createTone(659, 0.2), 100)
      setTimeout(() => createTone(784, 0.3), 200)
      break
      
    case 'incorrect':
      createTone(80, 1.2, 'sawtooth')
      setTimeout(() => createTone(60, 0.8, 'square'), 200)
      break
      
    case 'click':
      createTone(800, 0.1, 'square')
      break
      
    case 'reveal':
      createTone(200, 0.1)
      setTimeout(() => createTone(400, 0.1), 50)
      setTimeout(() => createTone(600, 0.2), 100)
      break

    case 'timer':
      // Return a function to stop the timer
      const interval = setInterval(() => {
        // Simple 2-note "Think!" melody simulation
        const now = ctx.currentTime
        createTone(440, 0.1, 'triangle', now) // A4
        createTone(554.37, 0.1, 'triangle', now + 0.25) // C#5
      }, 500)
      
      return () => clearInterval(interval)
  }
}