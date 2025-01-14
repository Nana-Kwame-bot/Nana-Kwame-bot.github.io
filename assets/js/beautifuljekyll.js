let BeautifulJekyllJS = {
  bigImgEl: null,
  numImgs: null,

  init: function () {
    // Initialize theme immediately
    BeautifulJekyllJS.initTheme();

    setTimeout(BeautifulJekyllJS.initNavbar, 10);

    // Shorten the navbar after scrolling a little bit down
    $(window).scroll(function () {
      if ($(".navbar").offset().top > 50) {
        $(".navbar").addClass("top-nav-short");
      } else {
        $(".navbar").removeClass("top-nav-short");
      }
    });

    // On mobile, hide the avatar when expanding the navbar menu
    $('#main-navbar').on('show.bs.collapse', function () {
      $(".navbar").addClass("top-nav-expanded");
    });
    $('#main-navbar').on('hidden.bs.collapse', function () {
      $(".navbar").removeClass("top-nav-expanded");
    });

    // show the big header image
    BeautifulJekyllJS.initImgs();

    // Add event listener for dark light mode toggle switch
    const toggleButton = document.getElementById('dark-light-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', BeautifulJekyllJS.toggleDarkLightMode);
    }
  },

  initTheme: function () {
    const savedTheme = localStorage.getItem('theme-preference') || 'dark'; // Changed default to 'dark'
    const body = document.body;
    const toggleButton = document.getElementById('dark-light-toggle');

    // Apply the saved theme
    body.classList.add(savedTheme + '-mode');

    // Update toggle button if it exists
    if (toggleButton) {
      toggleButton.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
  },

  toggleDarkLightMode: function () {
    const body = document.body;
    const currentMode = body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newMode = currentMode === 'dark' ? 'light' : 'dark';

    // Update classes
    body.classList.remove(currentMode + '-mode');
    body.classList.add(newMode + '-mode');

    // Update toggle button
    const toggleButton = document.getElementById('dark-light-toggle');
    if (toggleButton) {
      toggleButton.textContent = newMode === 'dark' ? '🌙' : '☀️';
    }

    // Store preference
    localStorage.setItem('theme-preference', newMode);

    // Re-initialize navbar to update its appearance
    BeautifulJekyllJS.initNavbar();
  },

  initNavbar: function () {
    // Set the navbar-dark/light class based on its background color
    const rgb = $('.navbar').css("background-color").replace(/[^\d,]/g, '').split(",");
    const brightness = Math.round(( // http://www.w3.org/TR/AERT#color-contrast
      parseInt(rgb[0]) * 299 +
      parseInt(rgb[1]) * 587 +
      parseInt(rgb[2]) * 114
    ) / 1000);
    if (brightness <= 125) {
      $(".navbar").removeClass("navbar-light").addClass("navbar-dark");
    } else {
      $(".navbar").removeClass("navbar-dark").addClass("navbar-light");
    }
  },

  initImgs: function () {
    // If the page was large images to randomly select from, choose an image
    if ($("#header-big-imgs").length > 0) {
      BeautifulJekyllJS.bigImgEl = $("#header-big-imgs");
      BeautifulJekyllJS.numImgs = BeautifulJekyllJS.bigImgEl.attr("data-num-img");

      // set an initial image
      const imgInfo = BeautifulJekyllJS.getImgInfo();
      const src = imgInfo.src;
      const desc = imgInfo.desc;
      BeautifulJekyllJS.setImg(src, desc);

      // For better UX, prefetch the next image so that it will already be loaded when we want to show it
      const getNextImg = function () {
        const imgInfo = BeautifulJekyllJS.getImgInfo();
        const src = imgInfo.src;
        const desc = imgInfo.desc;

        const prefetchImg = new Image();
        prefetchImg.src = src;
        // if I want to do something once the image is ready: `prefetchImg.onload = function(){}`

        setTimeout(function () {
          const img = $("<div></div>").addClass("big-img-transition").css("background-image", 'url(' + src + ')');
          $(".intro-header.big-img").prepend(img);
          setTimeout(function () { img.css("opacity", "1"); }, 50);

          // after the animation of fading in the new image is done, prefetch the next one
          setTimeout(function () {
            BeautifulJekyllJS.setImg(src, desc);
            img.remove();
            getNextImg();
          }, 1000);
        }, 6000);
      };

      // If there are multiple images, cycle through them
      if (BeautifulJekyllJS.numImgs > 1) {
        getNextImg();
      }
    }
  },

  getImgInfo: function () {
    const randNum = Math.floor((Math.random() * BeautifulJekyllJS.numImgs) + 1);
    const src = BeautifulJekyllJS.bigImgEl.attr("data-img-src-" + randNum);
    const desc = BeautifulJekyllJS.bigImgEl.attr("data-img-desc-" + randNum);

    return {
      src: src,
      desc: desc
    }
  },

  setImg: function (src, desc) {
    $(".intro-header.big-img").css("background-image", 'url(' + src + ')');
    if (typeof desc !== typeof undefined && desc !== false) {
      $(".img-desc").text(desc).show();
    } else {
      $(".img-desc").hide();
    }
  }
};

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', BeautifulJekyllJS.init);

// Initialize theme as soon as possible to prevent flash of wrong theme
(function () {
  const savedTheme = localStorage.getItem('theme-preference') || 'light';
  document.body.classList.add(savedTheme + '-mode');
})();