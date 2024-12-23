console.log("JavaScript is working!");
var currentSong = new Audio();
let songs = [];
document.querySelector(".playbar").classList.toggle("playbar-r");
let value = document.querySelector(".range").getElementsByTagName("input")[0];
let currFolder;
let range = document.querySelector(".range").getElementsByTagName("input")[0];
let old_volume = [];
let old_value = [];

function secondsToMinsSec(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

// Fetch songs from the server
async function getsongs(folder) {
  currFolder = folder;
  const a = await fetch(`http://127.0.0.1:3000/${currFolder}`);
  const response = await a.text();
  const div = document.createElement("div");
  div.innerHTML = response;
  const links = div.getElementsByTagName("a");

  songs = [];
  for (let link of links) {
    if (link.href.endsWith(".mp3")) {
      songs.push(link.href.split(`/${currFolder}/`)[1]);
    }
  }

  const songUL = document.querySelector(".songList ul");
  songUL.innerHTML = "";

  for (const song of songs) {
    songUL.innerHTML += `
      <li>
        <img class="invert" src="svgs/music.svg" alt="music" />
        <div class="info">
          <div>${
            song
              .replaceAll("%20", "")
              .replace(".mp3", "")
              .split("-")[0]
              .split(",")[0]
          }</div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="svgs/play.svg" alt="play" />
        </div>
      </li>`;
  }

  // Attach event listeners to each song
  Array.from(songUL.getElementsByTagName("li")).forEach((li, idx) => {
    li.addEventListener("click", () => {
      playMusic(songs[idx]);
    });
  });

  return songs;
}

function url_reseter(backwards = false) {
  if (backwards) {
    currentSong.src = `/${currFolder}/` + songs[songs.length - 1]; // Set the current song source
  } else {
    currentSong.src = `/${currFolder}/` + songs[0]; // Set the current song source
  }
}

const playMusic = async (track, pause = false) => {
  if (!songs || songs.length === 0) {
    songs = await getsongs("songs/favs"); // Fetch the songs if not already fetched
  }

  // Normalize the track to match the songs array
  const normalizedTrack = track.replaceAll("%20", "").toLowerCase();
  const index = songs.findIndex((song) =>
    song.replaceAll("%20", "").toLowerCase().includes(normalizedTrack)
  );

  if (index === -1) {
    console.error(`Track "${track}" not found in song list.`);
    return;
  }

  currentSong.src = `/${currFolder}/` + songs[index]; // Set the current song source

  if (!pause) {
    play.src = "svgs/pause.svg";
    await currentSong.play(); // Play the song
  }

  // Update UI with song information
  document.querySelector(".songinfo").innerHTML = songs[index]
    .replaceAll("%20", "")
    .replace(".mp3", "")
    .split("-")[0]
    .split(",")[0];
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  const a = await fetch(`http://127.0.0.1:3000/songs`);
  const response = await a.text();
  const div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);

  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").slice(-2)[0];
      // * Get the meta data of the folder
      const a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
      let response = await a.json();

      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-folder="${folder}" class="card">
              <div class="play playHover">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 20V4L19 12L5 20Z"
                    stroke="#141B34"
                    fill="#000"
                    stroke-width="1.5"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </div>
              <img src="/songs/${folder}/cover.jpg" alt="Happy Hits Cover" />
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div>`;
    }
  }

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0])
    });
  });
}

// Main function
async function main() {
  songs = await getsongs("songs/favs");
  if (songs[2]) {
    playMusic(songs[2], true);
  } else {
    playMusic(songs[0], true);
  }

  //* Display all the albums on the page
  displayAlbums();

  // Play/pause button
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "svgs/pause.svg";
    } else {
      currentSong.pause();
      play.src = "svgs/play.svg";
    }
  });

  // play/pause with space

  document.addEventListener("keypress", (e) => {
    if (e.key == " ") {
      e.preventDefault(); // Prevent the default scrolling behavior
      if (currentSong.paused) {
        currentSong.play();
        play.src = "svgs/pause.svg";
      } else {
        currentSong.pause();
        play.src = "svgs/play.svg";
      }
    }
  });

  // Update song time
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinsSec(
      currentSong.currentTime
    )} / ${secondsToMinsSec(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Seek bar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    const percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Hamburger menu
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
    document.querySelector(".playbar").classList.toggle("playbar-r");
  });

  // Close menu
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".playbar").classList.toggle("playbar-r");
    document.querySelector(".left").style.left = "-120%";
  });

  // Previous button
  previous.addEventListener("click", () => {
    index = songs.indexOf(currentSong.src.split("/").pop());
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    } else {
      url_reseter((backwards = true));
      index = songs.indexOf(currentSong.src.split("/").pop());
      playMusic(songs[index]);
    }
  });

  // Next button
  next.addEventListener("click", () => {
    index = songs.indexOf(currentSong.src.split("/").pop());
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    } else {
      url_reseter();
      index = songs.indexOf(currentSong.src.split("/").pop());
      playMusic(songs[index]);
    }
  });

  // Add an event to volume

  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      let vol = parseInt(e.target.value) / 100;
      currentSong.volume = vol;
    });

  document.addEventListener("keydown", function (event) {
    // Check if an arrow key is pressed
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
    ) {
      event.preventDefault(); // Prevent the default scrolling behavior
    }

    let vol = currentSong.volume;
    let rangeInput = document
      .querySelector(".range")
      .getElementsByTagName("input")[0];

    switch (event.key) {
      case "ArrowUp":
        if (vol <= 0.97) {
          // Prevent volume from going above 1
          currentSong.volume += 0.03;
          rangeInput.value = Math.round(currentSong.volume * 100); // Update the range input
        } else {
          currentSong.volume = 1;
          rangeInput.value = 100;
        }
        break;

      case "ArrowDown":
        if (vol >= 0.03) {
          // Prevent volume from going below 0
          currentSong.volume -= 0.03;
          rangeInput.value = Math.round(currentSong.volume * 100); // Update the range input
        } else {
          currentSong.volume = 0;
          rangeInput.value = 0;
        }
        break;

      case "ArrowLeft":
        currentSong.currentTime -= 5;
        currentSong.pause();
        currentSong.currentTime -= 5; // Move backward 5 seconds
        setTimeout(() => {
          currentSong.play(); // Resume playback after 100ms (ensure time change is applied)
        }, 1000);
        break;

      case "ArrowRight":
        currentSong.currentTime += 5;
        currentSong.pause();
        currentSong.currentTime += 5; // Move backward 5 seconds
        setTimeout(() => {
          currentSong.play(); // Resume playback after 100ms (ensure time change is applied)
        }, 1000);
        break;

      default:
    }
  });

  // Add event listner to mute the track
  document.querySelector(".volume > img").addEventListener("click", (e) => {
    if (e.target.src.includes("svgs/sound.svg")) {
      e.target.src = "svgs/mute.svg";
      old_value.push(range.value);
      old_volume.push(currentSong.volume);
      console.log(old_value);

      range.value = 0;
      currentSong.volume = 0;
    } else {
      currentSong.volume = old_volume[0];
      range.value = old_value[0];
      e.target.src = "svgs/sound.svg";
      old_value = [];
      old_volume = [];
    }
  });
}

main();
