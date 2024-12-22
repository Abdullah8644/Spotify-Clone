console.log("JavaScript is working!");
var currentSong = new Audio();
let songs = [];
document.querySelector(".playbar").classList.toggle("playbar-r")

// Convert seconds to MM:SS format
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
async function getsongs() {
  const response = await fetch("/songs.html");
  const text = await response.text();
  const div = document.createElement("div");
  div.innerHTML = text;
  const links = div.getElementsByTagName("a");

  let songs = [];
  for (let link of links) {
    if (link.href.endsWith(".mp3")) {
      songs.push(link.href.split("/songs/")[1]);
    }
  }
  return songs;
}

function url_reseter(backwards = false) {
  if (backwards) {
    currentSong.src = "/songs/" + songs[songs.length-1]; // Set the current song source
  }
  currentSong.src = "/songs/" + songs[0]; // Set the current song source
}

const playMusic = async (track, pause = false) => {
  if (!songs || songs.length === 0) {
    songs = await getsongs(); // Fetch the songs if not already fetched
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

  console.log(`Playing track index: ${index}, Name: ${songs[index]}`);

  currentSong.src = "/songs/" + songs[index]; // Set the current song source

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

// Main function
async function main() {
  songs = await getsongs();
  playMusic(songs[2], true);

  const songUL = document.querySelector(".songList ul");
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
      console.log(songs[idx]);
    });
  });

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
    console.log(document.querySelector(".playbar"))
    document.querySelector(".playbar").classList.toggle("playbar-r")
    
  });

  // Close menu
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".playbar").classList.toggle("playbar-r")
    document.querySelector(".left").style.left = "-120%";

  });

  // Previous button
  previous.addEventListener("click", () => {
    index = songs.indexOf(currentSong.src.split("/").pop());
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    } else {
      url_reseter(backwards=true);
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
}

main();
