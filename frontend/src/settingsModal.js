'use strict';
import { state } from './state.js';
import { setMode, setAlarmSound } from './script.js';

let soundChanged = false;
let currentAudio = null;
let errorTimeout;

$('#settingsModal').on('show.bs.modal', function () {
  // Populate the settings modal with current state values
  $('#workDuration').val(
    Math.round((state.timerDurationWork / 60) * 100) / 100
  );
  $('#shortBreakDuration').val(
    Math.round((state.timerDurationBreak / 60) * 100) / 100
  );
  $('#longBreakDuration').val(
    Math.round((state.timerDurationLongBreak / 60) * 100) / 100
  );

  $('#longBreakInterval').val(state.longBreakInterval);
});

// update input values with current settings
$('#saveSettingsBtn').on('click', function () {
  console.log('Save settings button clicked');

  // Get the new values from the input fields
  const workDuration = Math.round(parseFloat($('#workDuration').val()) * 60);
  const shortBreakDuration = Math.round(
    parseFloat($('#shortBreakDuration').val()) * 60
  );
  const longBreakDuration = Math.round(
    parseFloat($('#longBreakDuration').val()) * 60
  );
  const longBreakInterval = Math.round(
    parseFloat($('#longBreakInterval').val())
  );
  // Validate the inputs
  if (!validateInputs()) {
    console.log('Invalid inputs, not updating state.');
    return;
  }

  console.log('Inputs are valid, updating state.');
  // Update the state with new values
  state.timerDurationWork = workDuration;
  state.timerDurationBreak = shortBreakDuration;
  state.timerDurationLongBreak = longBreakDuration;
  state.longBreakInterval = longBreakInterval;

  // update local storage with new state
  localStorage.setItem('timerDurationWork', state.timerDurationWork);
  localStorage.setItem('timerDurationBreak', state.timerDurationBreak);
  localStorage.setItem('timerDurationLongBreak', state.timerDurationLongBreak);
  localStorage.setItem('longBreakInterval', state.longBreakInterval);

  // update the UI
  setMode();
  console.log('Updated state:', state);

  // save sound settings if sound has changed
  const currentSound = state.selectedSound;
  const selectedSound = $('#alarmSound').val();
  if (currentSound !== selectedSound) {
    setAlarmSound(selectedSound);
    console.log('Saved sound setting:', selectedSound);
  }
  // Close the modal
  $('#settingsModal').modal('hide');
});

const showError = (message) => {
  $('#errorContainer').text(message).show();

  // Clear any existing hide timer
  if (errorTimeout) {
    clearTimeout(errorTimeout);
  }

  // Set a new hide timer
  errorTimeout = setTimeout(() => {
    $('#errorContainer').hide();
  }, 5000);
};
const validateInputs = () => {
  // Clear any previous error messages
  $('#errorContainer').hide().text('');

  const workDuration = parseFloat($('#workDuration').val());
  const shortBreakDuration = parseFloat($('#shortBreakDuration').val());
  const longBreakDuration = parseFloat($('#longBreakDuration').val());
  const longBreakInterval = parseInt($('#longBreakInterval').val(), 10);

  if (
    isNaN(workDuration) ||
    isNaN(shortBreakDuration) ||
    isNaN(longBreakDuration) ||
    isNaN(longBreakInterval)
  ) {
    showError('Please enter valid numbers for all fields.');
    // set input fields to initial values
    $('#workDuration').val(
      Math.round((state.timerDurationWork / 60) * 100) / 100
    );
    $('#shortBreakDuration').val(
      Math.round((state.timerDurationBreak / 60) * 100) / 100
    );
    $('#longBreakDuration').val(
      Math.round((state.timerDurationLongBreak / 60) * 100) / 100
    );
    $('#longBreakInterval').val(state.longBreakInterval);
    return false;
  }

  if (workDuration <= 0 || shortBreakDuration <= 0 || longBreakDuration <= 0) {
    showError('Durations must be greater than zero.');
    $('#workDuration').val(
      Math.round((state.timerDurationWork / 60) * 100) / 100
    );
    $('#shortBreakDuration').val(
      Math.round((state.timerDurationBreak / 60) * 100) / 100
    );
    $('#longBreakDuration').val(
      Math.round((state.timerDurationLongBreak / 60) * 100) / 100
    );
    return false;
  }

  if (longBreakInterval <= 0) {
    showError('Long break interval must be a positive integer.');
    $('#longBreakInterval').val(state.longBreakInterval);

    return false;
  }

  return true;
};

// play sound when sound dropdown changes
$('#alarmSound').on('change', function () {
  const currentSound = state.selectedSound;
  const selectedSound = $(this).val();
  console.log('Selected sound:', selectedSound);

  if (selectedSound) {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0; // Reset the audio to the beginning
    }
    currentAudio = new Audio(`audio/${selectedSound}.mp3`);
    currentAudio.play().catch((error) => {
      console.error('Error playing sound:', error);
    });
  }
});
