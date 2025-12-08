// Add debug logging at the top
console.log("Script loaded");
console.log("Is mobile:", ("ontouchstart" in window || navigator.maxTouchPoints > 0) && window.innerWidth <= 768);
console.log("Window width:", window.innerWidth);
console.log("Touch support:", "ontouchstart" in window);
console.log("Max touch points:", navigator.maxTouchPoints);

function isMobile() {
return (
    ("ontouchstart" in window || navigator.maxTouchPoints > 0) &&
    window.innerWidth <= 768 
);
}

function setupVideoFollow() {
    const selfGif = document.getElementById("self-gif");
    const video = document.getElementById("gif");
  
    if (!selfGif || !video) return;
  
    selfGif.addEventListener("mousemove", (e) => {
      video.style.left = `${e.clientX + 15}px`;
      video.style.top = `${e.clientY + 15}px`;
    });
  
    selfGif.addEventListener("mouseenter", () => {
      video.style.display = "block";
    });
  
    selfGif.addEventListener("mouseleave", () => {
      video.style.display = "none";
    });
}

document.querySelectorAll('.rotating-logo').forEach(logo => {
  let angle = 0;
  let animationFrameId = null;

  function rotate() {
    angle = (angle + 1.6) % 360;
    logo.style.transform = `rotate(${angle}deg)`;
    animationFrameId = requestAnimationFrame(rotate);
  }

  logo.addEventListener('mouseenter', () => {
    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(rotate);
    }
  });

  logo.addEventListener('mouseleave', () => {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  });
});

function makeCard(meta, authors, title, desc="", href = '#') {
  return `
     <div class="scroll-item">
       <a href="${href}">
         <div class="meta">${meta}</div>
         <div class="authors">${authors}</div>
         <div class="title">${title}</div>
       </a>
       <p>
       ${desc}
       </p>
     </div>
  `;
}

document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded, checking mobile again");
  
  // Handle mobile detection first
  if (isMobile()) {
    console.log("Mobile detected, showing blocker");
    const video = document.getElementById("gif");
    const blocker = document.getElementById("mobile-blocker");
    
    console.log("Video element:", video);
    console.log("Blocker element:", blocker);
    
    if (video) {
      video.remove();
      console.log("Video removed");
    }
    if (blocker) {
      blocker.classList.remove("hidden");
      blocker.classList.add("flex");
      console.log("Blocker should now be visible");
    }
  } else {
    console.log("Not mobile, setting up video follow");
    setupVideoFollow();
  }

  const projectData =[
    // {meta:"NEW", authors:"Armaan Chowfin and Narayan Rangaraj", title:"OPTIMIZED RAILWAY TIMETABLES", desc:"The Mumbai Local trains are experiencing a crisis: 20 deaths and grevious injuries every day.\n\nOver the next 10 years, the Mumbai Rail Vikas Corporation (MRVC) aims to phase out the non-AC rakes plying the Mumbai suburban railway network, and replace them with AC rakes with closing doors. To achieve this, the MRVC requires a data-driven approach to explore the rakes most suitable for replacement. The goal of this Github Project is to provide such a tool in the form of an extensible, GUI-based application.\nUsing a software representation of the railway timetable, the simulator generates an interactive rake-cycle visualization. Users can select any time period of interest and run analyses based on constraints derived from passenger preferences. One key analysis measures the “mixing” of AC and non-AC rakes at stations, quantified via cross-entropy. Until full AC transition, the objective is to maximize this value to maintain a balanced mix across the network. Finally, using a PESP formulation of the rail scheduling problem, we intend to generate optimal timetables dynamically given the various constraints."},
    // {meta:"NEW", authors:"Armaan Chowfin and Daniel Schurmann", title:"IMROVED DJ SCRATCHING IN MIXXX", desc:"Mixxx uses the SoundTouch and RubberBand time-stretching libraries for resampling during a keyLock operation. However, these libraries are unsuitable for scratching due to the fast changing tempo and pitch. Currently a faster, handcrafted linear interpolation algorithm is used - but there have been reports of suboptimal audio quality.Digital Signal Processing (DSP) theory tells us that linear interpolation is not ideal, and that a sinc-based resampler will always return interpolated values identical to the original analog signal, under certain theoretical constraints. However, practical implementations of sinc resampling are computationally heavy and generally unsuitable for low-latency realtime software such as Mixxx. Therefore...One objective of this GSoC project was to explore the feasibility of using sinc interpolation for scratching. To this end, the libsamplerate and libzita resample latencies were evaluated.Another focus was to investigate and improve the performance of the current linear resampler. Here, we observed that the libsamplerate linear interpolator outperformed our own, reducing per-buffer resample latency from 20µs to 10µs."}
  ]

  const notesData = [
    {
      title: "0-test",
      audio: "assets/audio/1-intro.mp3"
    },
    // {
    //   title: "1 Grid Test",
    //   audio: "assets/audio/1-intro.mp3"
    // },
  ];


  function makeAudioTile(title, audioUrl) {
    return `
      <div class="note-tile">
      <p>${title}</p>
        <div class="audio-wrapper">
          <img src="assets/octotat-red.svg" class="audio-thumb">
          <audio controls preload="none">
            <source src="${audioUrl}" type="audio/mp3">
          </audio>
        </div>
      </div>
    `;
  }

  function buildNotesGrid(items) {
    let html = `<div class="notes-grid">`;
    items.forEach(item => {
      html += makeAudioTile(item.title, item.audio);
    });
    html += `</div>`;
    return html;
  }

  function buildColumnSection(items) {
    let html = `<div class="column-wrapper">`;
    items.forEach(item => {
      html += makeCard(item.meta, item.authors, item.title,item.desc, item.href);
    });
    html += `</div>`;
    return html;
  }

  const sectionContents = {
    Projects: buildColumnSection(projectData),
    Notes: buildNotesGrid(notesData)
  };

  // // Content for each section
  // const sectionContents = {
  //   Projects: `<div class="bracket-content"><p></p></div>`,
  //   Notes: `<div class="bracket-content"><p></p></div>`
  // };

  function loadSection(page) {
    // Update active state
    document.querySelectorAll('.bracket-item').forEach(i => {
      i.classList.toggle('underlined', i.dataset.page === page);
    });
    
    // Insert/replace dynamic content
    const container = document.getElementById('dynamic-content');
    container.innerHTML = sectionContents[page] || '';
  }

  // Handle bracket navigation
  document.querySelectorAll('.bracket-item[data-page]').forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      loadSection(this.dataset.page);
    });
  });

  // Handle other nav items
  document.querySelectorAll('.nav-item:not([data-page])').forEach(item => {
    item.addEventListener('click', function() {
      document.getElementById('dynamic-content').innerHTML = '';
      document.querySelectorAll('.bracket-item').forEach(i => {
        i.classList.remove('underlined');
      });
    });
  });

  // Load 'Notes' section by default on initial page load
  const defaultSection = 'Notes';
  loadSection(defaultSection);
  
  // Find and highlight the 'Notes' button in navbar
  const allButton = document.querySelector('.bracket-item[data-page="Notes"]');
  if (allButton) {
    allButton.classList.add('underlined');
  }

  // Handle bracket item clicks (your original bracket functionality)
  const bracketItems = document.querySelectorAll('.bracket-item');
  bracketItems.forEach(function(item) {
      item.addEventListener('click', function() {
          bracketItems.forEach(function(bracket) {
              bracket.classList.remove('underlined');
          });
          this.classList.add('underlined');
      });
  });
});