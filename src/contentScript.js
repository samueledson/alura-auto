'use strict';

window.addEventListener('load', function () {

  const mediaVideo = document.getElementById("video-player_html5_api");

  const options = {};

  const getAllStorageSyncData = () => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(null, (items) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(items);
      });
    });
  }

  const initStorageCache = getAllStorageSyncData().then(items => {
    Object.assign(options, items.options);
  });

  /*** MODULE - AUTO REDIRECT ***/
  const autoRedirect = () => {
    var videoLinksHTML = document.getElementsByClassName(
      "task-menu-nav-item-link task-menu-nav-item-link-VIDEO"
    );
  
    var videoLinks = [];
  
    for (var i = 0; i < videoLinksHTML.length; i++) {
      videoLinks.push(videoLinksHTML[i].href);
    }
  
    var currentVideoLink = document.location.href;
    var currentVideoLinkIndex = videoLinks.indexOf(currentVideoLink);
    var nextVideoLinkIndex = videoLinks[currentVideoLinkIndex + 1];
  
    mediaVideo.addEventListener("ended", () => {
      var urlNext = null;
      if (!options.bolNextVideo)
        urlNext = currentVideoLink + "/next";
      else if(nextVideoLinkIndex !== undefined) {
        urlNext = nextVideoLinkIndex;
      }
      if(urlNext !== null)
        document.location.href = urlNext;
    });
  }

  /*** MODULE - AUTO PLAY ***/
  const autoPlay = () => {
    mediaVideo.addEventListener(
      "canplay",
      function () {

        mediaVideo.muted = true;
        mediaVideo.volume = 0;

        mediaVideo.autoplay = true;

        var playPromise = mediaVideo.play();

        if (playPromise !== undefined) {
          playPromise.then(_ => {
            mediaVideo.muted = false;
            mediaVideo.volume = 1;
          })
          .catch(error => {
            
          });
        }
      },
      false
    );
  }

  const fire = async () => {

    try {

      await initStorageCache;

      if(options.bolNext && mediaVideo !== null)
        autoRedirect();

      if (options.bolPlayVideoAuto && mediaVideo !== null)
        autoPlay();

    } catch (e) {
      console.log(e);
    }    
      
  }

  fire();    

});
