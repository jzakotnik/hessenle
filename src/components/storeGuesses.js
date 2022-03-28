import moment from 'moment';

function loadAllGuesses() {
  const storedGuesses = localStorage.getItem('guessData');
  return storedGuesses != null ? JSON.parse(storedGuesses) : {};
}

export function saveGuessesToStorage(dayString, guessData) {
  const allGuesses = loadAllGuesses();
  localStorage.setItem(
    'guessData',
    JSON.stringify({
      ...allGuesses,
      [dayString]: guessData,
    }),
  );
}

export function getTodaysGuessesFromStorage() {
  const storedGuesses = JSON.parse(localStorage.getItem('guessData'));
  const today = moment().format('DDMMYYYY');
  const defaultGuessData = {
    guessNumber: 0,
    guessContent: ['open', 'open', 'open', 'open', 'open', 'open'],
    guessResult: [],
  };
  return storedGuesses != null && storedGuesses.hasOwnProperty(today) ? storedGuesses[today] : defaultGuessData;
}
