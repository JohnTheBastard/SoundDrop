
const CLIENT_ID = '2t9loNQH90kzJcsFCODdigxfp325aq4z'
const INFO_BASE_URL = 'https://api.soundcloud.com/resolve.json'
const TRACK_BASE_URL = 'https://api.soundcloud.com/tracks'

const errorElement = document.getElementById('error')
const playerElement = document.getElementById('player')

const showError = (msg) => {
  errorElement.innerText = msg
}

const clearError = () => {
  errorElement.innerText = ''
}

/**
 * @param {string} trackId
 * @returns {string}
 */
const getInfoUrl = (url) => {
  return `${INFO_BASE_URL}?url=${encodeURIComponent(url)}&client_id=${CLIENT_ID}`
}

/**
 * @param {string} trackId
 * @returns {string}
 */
const getStreamUrl = (trackId) => {
  return `${TRACK_BASE_URL}/${trackId}/stream?client_id=${CLIENT_ID}`
}

const fetchStream = (url) => {
  clearError()
  if (!window.fetch) {
    showError('Sorry, your browser is not supported. Please try using a newer one.')
    return
  }
  if (!url || !url.startsWith('https://') || !url.includes('soundcloud.com')) {
    showError('Please enter a valid HTTPS SoundCloud URL.')
    return
  }

  window.fetch(getInfoUrl(url)).then((response) => {
    if (response.url) {
      const trackIdMatch = response.url.match(/\/tracks\/(\d+?).json/)
      const trackId = trackIdMatch && trackIdMatch[1]
      if (trackId) {
        const streamUrl = getStreamUrl(trackId)
        playerElement.querySelector('iframe').src = streamUrl
        playerElement.style.display = 'block'
        return
      }
    }
    showError('Oops, we could\'t get a track from that URL.')
  })
  .catch((e) => {
    showError(e)
  })
}

document.querySelector('button').addEventListener('click', () => {
  fetchStream(document.querySelector('input').value)
})
