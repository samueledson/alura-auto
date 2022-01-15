'use strict';

import './popup.css';

(function() {

  const options = {};

  const checkboxOptions = document.querySelectorAll(".option input[type=checkbox]");

  const verifyOptions = (option, value) => {
    if(option == "bolNext"){
      var bolNextVideo = document.querySelector("input[type=checkbox][name=bolNextVideo]");
      bolNextVideo.disabled = !Boolean(value);
      if(!Boolean(value))
        bolNextVideo.checked = false;
    }
  }

  chrome.storage.sync.get('options', (data) => {
    Object.assign(options, data.options);
    Object.entries(options).forEach(([option, value]) => {
      document.querySelector("input[type=checkbox][name="+option+"]").checked = Boolean(value);
      verifyOptions(option, value);
    });
  });

  checkboxOptions.forEach((option) => {
    option.addEventListener('change', function() {
      options[this.name] = this.checked;
      chrome.storage.sync.set({options});
      verifyOptions(this.name, this.checked);
    })
  });

})();