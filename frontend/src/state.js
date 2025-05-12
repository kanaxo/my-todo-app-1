export const state = {
  toDoArr: [],
  checkedArray: [],
  mode: 'work',
  timerDurationWork: 1,
  timerDurationBreak: 2,
  timerDurationLongBreak: 3,
  workStats: null
};

export function updateState(newState) {
  for (const key in newState) {
    if (key in state) {
      state[key] = newState[key];
    }
  }
  console.log('New state:', state);
}

export const defaultState = {
  toDoArr: [],
  checkedArray: [],
  mode: 'work',
  timerDurationWork: 1,
  timerDurationBreak: 2,
  timerDurationLongBreak: 3,
  workStats: null
};

// export const loggedOutState = {};

// export function setLoggedOutState(newState) {
//   for (const key in newState) {
//     loggedOutState[key] = newState[key];
//   }
//   console.log('loggedOutState', loggedOutState);
// }
