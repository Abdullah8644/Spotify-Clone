console.log("JavaScript is working!");
var currentSong = new Audio();

function secondsToMinsSec(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const mintues = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const forrmattedMinutes = String(mintues).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${forrmattedMinutes}:${formattedSeconds}`;
}

async function getsongs() {
  let a = await fetch("/songs.html");
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = await response;
  let as = div.getElementsByTagName("a");

  let songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }

  return songs;
}

const playMusic = async (track, pause = false, auto = false) => {
  if (!auto) {
    songs = await getsongs();
    console.log(songs);
    index = 0;
    for (song of songs) {
      index++;
      song = song.replaceAll("%20", "");
      if (song.includes(track)) {
        break;
      }
    }

    currentSong.src = "/songs/" + songs[index - 1];
    if (!pause) {
      play.src = "svgs/pause.svg";
      await currentSong.play();
    }

    document.querySelector(".songinfo").innerHTML = track
      .replaceAll("%20", "")
      .replace(".mp3", "")
      .split("-")[0]
      .split(",")[0];
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
  } else {
    songs = await getsongs();
    console.log(songs);
    currentSong.src = "/songs/" + songs[2];

    document.querySelector(".songinfo").innerHTML = track
      .replaceAll("%20", "")
      .replace(".mp3", "")
      .split("-")[0]
      .split(",")[0];
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
  }
};

async function main() {
  let songs = await getsongs();
  playMusic(songs[2], true, (auto = true));

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
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

  // Attach an event listenr to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      music = e.querySelector(".info").firstElementChild.innerHTML.trim();
      console.log("Playing");
      playMusic(music, false);
    });
  });

  // *  Attach an event listener to the next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "svgs/pause.svg";
      console.log("Playing");
    } else {
      currentSong.pause();
      play.src = "svgs/play.svg";
      console.log("Pausing");
    }
  });

  //* Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinsSec(
      currentSong.currentTime
    )} / ${secondsToMinsSec(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Add an event listenr to seek bar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    console.log((currentSong.duration * percent) / 100);
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
}

main();
