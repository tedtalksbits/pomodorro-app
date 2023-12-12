const soundCheckbox = document.querySelector('#soundCheckbox');

soundCheckbox.checked = localStorage.getItem('isSoundEnabled') === 'true';
soundCheckbox.addEventListener('change', (event) => {
  const isSoundEnabled = event.target.checked;
  localStorage.setItem('isSoundEnabled', isSoundEnabled);
});

class NotificationSound {
  constructor() {
    this.audio = new Audio('./static/sounds/notification.wav');
  }

  play() {
    this.audio.play();
  }
}

export class SoundSettings {
  constructor() {
    this.soundCheckbox = document.querySelector('#soundCheckbox');
    this.soundCheckbox.checked =
      localStorage.getItem('isSoundEnabled') === 'true';
    this.soundCheckbox.addEventListener('change', (event) => {
      const isSoundEnabled = event.target.checked;
      localStorage.setItem('isSoundEnabled', isSoundEnabled);
    });
  }

  isSoundEnabled() {
    return this.soundCheckbox.checked;
  }

  playNotificationSound() {
    if (this.isSoundEnabled()) {
      const notificationSound = new NotificationSound();
      notificationSound.play();
    }
  }
}
