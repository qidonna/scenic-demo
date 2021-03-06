/**
 * Helps demonstrate metering functionality.
 *
 * Publishers shouldn't use these methods in production. Instead, they should
 * define their own JS and backend code to provide the same functionality securely.
 */
export const MeteringDemo = {
  /** Google Sign-In Client ID for the metering demo. */
  GOOGLE_SIGN_IN_CLIENT_ID:
    '520465458218-e9vp957krfk2r0i4ejeh6aklqm7c25p4.apps.googleusercontent.com',

  /** Google Sign-In redirect URI, where users are sent after signing in. */
  GOOGLE_SIGN_IN_REDIRECT_URI: 'https://scenic-2017.appspot.com/gsi-redirect',

  /** Sets up controls for the metering demo. */
  setupControls: () => {
    // Wire up buttons.
    document
        .querySelector('#metering-controls .reset-metering-demo')
        .addEventListener('click', MeteringDemo.resetMeteringDemo);

    // Show reset button.
    document.body.classList.add('metering');

    // Update nav button to carry over full URL query.
    document.querySelectorAll('header .nav-button').forEach(navButton => {
      navButton.href = navButton.href.replace(/\?.*/, location.search);
    });
  },

  /** Resets the metering demo. */
  resetMeteringDemo: () => {
    // Forget the existing PPID.
    delete localStorage.meteringPpid;

    // Forget the existing registration timestamp.
    delete localStorage.meteringRegistrationTimestamp;

    // Delete the existing username.
    delete localStorage.meteringUsername;

    // Sign out of Google Sign-In.
    self.GaaMeteringRegwall.signOut().then(() => void location.reload());
  },

  /** Returns a new Publisher Provided ID (PPID) suitable for demo purposes. */
  createPpid: () => 'ppid' + Math.round(Math.random() * 999999),

  /** Returns a Publisher Provided ID (PPID) suitable for demo purposes. */
  getPpid: () => {
    if (!localStorage.meteringPpid) {
      localStorage.meteringPpid = MeteringDemo.createPpid();
    }

    // Log and render PPID for demo purposes.
    console.log('Metering PPID: ' + localStorage.meteringPpid);
    const ppidEl = document.querySelector('#metering-controls .ppid');
    ppidEl.textContent = localStorage.meteringPpid;
    ppidEl.style.display = 'block';

    return localStorage.meteringPpid;
  },

  /** Opens the paywall for demo purposes. */
  openPaywall: () => {
    document.documentElement.classList.add('open-paywall');
  },

  /** Returns the user's metering state, including when the user registered. */
  fetchMeteringState: () => {
    // Logs the username, for the metering demo.
    if (localStorage.meteringUsername) {
      console.log(`👋 Hello, ${localStorage.meteringUsername}!`);
    }

    return Promise.resolve({
      id: MeteringDemo.getPpid(),
      registrationTimestamp: localStorage.meteringRegistrationTimestamp,
    });
  },
};
