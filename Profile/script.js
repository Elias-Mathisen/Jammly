const clientId = 'YOUR_CLIENT_ID';
const redirectUri = 'YOUR_REDIRECT_URI';
const scopes = ['user-top-read','user-read-recently-played', 'playlist-modify-public', 'user-read-private', 'user-read-currently-playing', 'user-read-playback-state'];
const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.join(' '))}`;

const timeRanges = {
  'short_term': 'Past 4 Weeks',
  'medium_term': 'Past 6 Months',
  'long_term': 'Past Year'
};

let allTracks = [];
let allArtists = [];
let allGenres = [];
const scrollAmount = 7;
let currentIndex = 0;
let currentIndexArtists = 0;
let currentIndexTracks = 0;
let currentRange = 'short_term';

function getUserStats(timeRange) {
  currentRange = timeRange; 

  const accessToken = getAccessTokenFromUrl();
  if (!accessToken) {
    window.location.href = authUrl;
    return;
  }

  const timeRangeText = timeRanges[timeRange];
  const timeRangeElements = document.getElementsByClassName("time-range-text");
  for (let i = 0; i < timeRangeElements.length; i++) {
    timeRangeElements[i].textContent = timeRangeText;
  }

  console.log('Current Time Range:', currentRange);

  fetchUserProfile(accessToken)
    .then(profile => {
      const { displayName, profilePicture } = profile;
      displayUserInformation(displayName, profilePicture);
    })
    .catch(error => {
      console.log('Error fetching user profile:', error);
    });

  fetchUserTopTracks(accessToken, timeRange)
    .then(tracks => {
      allTracks = tracks;
      displayTopTracks(allTracks);
    })
    .catch(error => {
      console.log('Error fetching top tracks:', error);
    });

  fetchUserTopArtists(accessToken, timeRange)
    .then(artists => {
      allArtists = artists;
      displayTopArtists(allArtists);
    })
    .catch(error => {
      console.log('Error fetching top artists:', error);
    });

  fetchUserTopGenres(accessToken, timeRange)
    .then(genres => {
      allGenres = genres;
      displayTopGenres(allGenres);
    })
    .catch(error => {
      console.log('Error fetching top genres:', error);
    });

  fetchUserRecentlyPlayed(accessToken)
    .then(recentlyPlayed => {
      displayRecentlyPlayed(recentlyPlayed);
    })
    .catch(error => {
      console.log('Error fetching recently played tracks:', error);
    });

}

function fetchUserProfile(accessToken) {
  return fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then(response => response.json())
    .then(data => {
      const displayName = data.display_name;
      const profilePicture = data.images.length > 0 ? data.images[0].url : null;
      return { displayName, profilePicture };
    });
}

function getAccessTokenFromUrl() {
  const hashParams = window.location.hash.substr(1).split('&');
  for (const param of hashParams) {
    const [key, value] = param.split('=');
    if (key === 'access_token') {
      return value;
    }
  }
  return null;
}

function displayUserInformation(displayName, profilePicture) {
  const nameElement = document.getElementById('user-name');
  nameElement.textContent = displayName;
  const picElement = document.getElementById('profile-picture-head');
  picElement.setAttribute('src', profilePicture);
  const Profilepic = document.getElementById('profile-picture');
  Profilepic.setAttribute('src', profilePicture);
}

function fetchUserTopAlbums(accessToken, timeRange) {
  const url = `https://api.spotify.com/v1/me/top/albums?time_range=${timeRange}&limit=50`;

  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
    .then(response => response.json())
    .then(data => data.items)
    .catch(error => {
      throw new Error('Error fetching user top albums');
    });
}


function displayTopAlbums(albums) {
  const topAlbumsContainer = document.getElementById('top-albums');
  topAlbumsContainer.innerHTML = '';

  albums.forEach((album, index) => {
    const statsItem = createStatsItem(index + 1, album.images[0].url, album.name, album.artists[0].name);
    topAlbumsContainer.appendChild(statsItem);
  });

  console.log('Collected Albums:');
  albums.forEach((album, index) => {
    console.log(`${index + 1}. ${album.name} - ${album.artists[0].name}`);
  });

  console.log('Total Albums:', albums.length);
}

function fetchUserTopTracks(accessToken, timeRange) {
  const url = `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=50`;

  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
    .then(response => response.json())
    .then(data => data.items)
    .catch(error => {
      throw new Error('Error fetching user top tracks');
    });
}

function fetchUserTopArtists(accessToken, timeRange) {
  const url = `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=21`;

  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
    .then(response => response.json())
    .then(data => data.items)
    .catch(error => {
      throw new Error('Error fetching user top artists');
    });
}

function fetchUserTopGenres(accessToken, timeRange) {
  const url = `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=21`;

  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
    .then(response => response.json())
    .then(data => {
      const genres = [];
      data.items.forEach(artist => {
        genres.push(...artist.genres);
      });
      return genres;
    })
    .catch(error => {
      throw new Error('Error fetching user top genres');
    });
}

function fetchUserRecentlyPlayed(accessToken) {
  const url = 'https://api.spotify.com/v1/me/player/recently-played?limit=20';

  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
    .then(response => response.json())
    .then(data => data.items)
    .catch(error => {
      throw new Error('Error fetching user recently played tracks');
    });
}


function displayRecentlyPlayed(tracks) {
  const recentlyPlayedContainer = document.getElementById('recently-played');
  recentlyPlayedContainer.innerHTML = '';

  tracks.forEach((track, index) => {
    const statsItem = createStatsItem(index + 1, track.track.album.images[0].url, track.track.name, track.track.artists[0].name);
    recentlyPlayedContainer.appendChild(statsItem);
  });

  console.log('Recently Played Tracks:');
  tracks.forEach((track, index) => {
    console.log(`${index + 1}. ${track.track.name} - ${track.track.artists[0].name}`);
  });

  console.log('Total Recently Played Tracks:', tracks.length);
}

function displayRecentlyPlayed(tracks) {
  const recentlyPlayedContainer = document.getElementById('recently-played');
  recentlyPlayedContainer.innerHTML = '';

  tracks.forEach((track, index) => {
    const recentlyPlayedItem = createRecentlyPlayedItem(track.track.album.images[0].url, track.track.name, track.track.artists[0].name, track.played_at);
    recentlyPlayedContainer.appendChild(recentlyPlayedItem);
  });

  console.log('Recently Played Tracks:');
  tracks.forEach((track, index) => {
    console.log(`${index + 1}. ${track.track.name} - ${track.track.artists[0].name}`);
  });

  console.log('Total Recently Played Tracks:', tracks.length);
}

function createRecentlyPlayedItem(imageUrl, songName, artistName, timePlayed) {
  const recentlyPlayedItem = document.createElement('div');
  recentlyPlayedItem.classList.add('recent-listen-item');

  const image = document.createElement('img');
  image.src = imageUrl;

  const songInfo = document.createElement('div');
  songInfo.classList.add('song-info');

  const songNameElement = document.createElement('div');
  songNameElement.classList.add('song-name');
  songNameElement.textContent = songName;

  const artistNameElement = document.createElement('div');
  artistNameElement.classList.add('artist-name');
  artistNameElement.textContent = artistName;

  const timePlayedElement = document.createElement('div');
  timePlayedElement.classList.add('time-played');
  timePlayedElement.textContent = formatTimePlayed(timePlayed);

  songInfo.appendChild(songNameElement);
  songInfo.appendChild(artistNameElement);

  recentlyPlayedItem.appendChild(image);
  recentlyPlayedItem.appendChild(songInfo);
  recentlyPlayedItem.appendChild(timePlayedElement);

  return recentlyPlayedItem;
}
function formatTimePlayed(timePlayed) {
  const currentTime = new Date();
  const playedTime = new Date(timePlayed);

  const timeDifference = currentTime.getTime() - playedTime.getTime();
  const minutesDifference = Math.floor(timeDifference / 60000);

  if (minutesDifference < 60) {
    return `${minutesDifference} minutes ago`;
  } else {
    const hoursDifference = Math.floor(minutesDifference / 60);
    return `${hoursDifference} hours ago`;
  }
}



function displayTopTracks(tracks) {
  const topSongsContainer = document.getElementById('top-songs');
  topSongsContainer.innerHTML = '';

  tracks.forEach((track, index) => {
    const statsItem = createStatsItem(index + 1, track.album.images[0].url, track.name, track.artists[0].name);
    topSongsContainer.appendChild(statsItem);
  });

  console.log('Collected Songs:');
  tracks.forEach((track, index) => {
    console.log(`${index + 1}. ${track.name} - ${track.artists[0].name}`);
  });

  console.log('Total Songs:', tracks.length);
}

function displayTopArtists(artists) {
  const topArtistsContainer = document.getElementById('top-artists');
  topArtistsContainer.innerHTML = '';

  artists.forEach((artist, index) => {
    const statsItem = createStatsItem(index + 1, artist.images[0].url, artist.name, '', true);
    topArtistsContainer.appendChild(statsItem);
  });

  console.log('Collected Artists:');
  artists.forEach((artist, index) => {
    console.log(`${index + 1}. ${artist.name}`);
  });

  console.log('Total Artists:', artists.length);
}

function displayTopGenres(genres) {
  const genresContainer = document.getElementById('top-genres');
  genresContainer.innerHTML = '';

  const genreList = document.createElement('ul');
  genreList.classList.add('genre-list');

  genres.forEach((genre, index) => {
    const genreItem = document.createElement('li');
    genreItem.classList.add('genre-item');
    genreItem.textContent = genre;
    genreList.appendChild(genreItem);
  });

  genresContainer.appendChild(genreList);

  console.log('Collected Genres:');
  genres.forEach((genre, index) => {
    console.log(`${index + 1}. ${genre}`);
  });

  console.log('Total Genres:', genres.length);
}

function createStatsItem(index, imageUrl, title, subtitle, isArtist) {
  const statsItem = document.createElement('div');
  statsItem.classList.add('stats-item');

  const image = document.createElement('img');
  image.src = imageUrl;

  if (isArtist) {
    image.style.borderRadius = '50%';
  }

  const titleElement = document.createElement('div');
  titleElement.classList.add('title');
  titleElement.textContent = `${index}. ${title}`;

  const subtitleElement = document.createElement('div');
  subtitleElement.classList.add('artist');
  subtitleElement.textContent = subtitle;

  statsItem.appendChild(image);
  statsItem.appendChild(titleElement);
  statsItem.appendChild(subtitleElement);

  return statsItem;
}

function scrollToIndex(index, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return; 
  const containerWidth = container.clientWidth;
  const scrollWidth = container.scrollWidth;
  const scrollPosition = Math.max(0, scrollWidth - containerWidth);
  const scrollIndex = Math.min(index, Math.floor(allTracks.length / scrollAmount));

  container.scrollTo({
    left: scrollIndex * containerWidth,
    behavior: 'smooth'
  });
}

document.getElementById('scrollLeftArtists').addEventListener('click', () => {
  if (currentIndexArtists > 0) {
    currentIndexArtists -= 1;
    scrollToIndex(currentIndexArtists, 'top-artists');
  }
});

document.getElementById('scrollRightArtists').addEventListener('click', () => {
  const maxIndexArtists = Math.ceil(allArtists.length / scrollAmount) - 1;
  if (currentIndexArtists < maxIndexArtists) {
    currentIndexArtists += 1;
    scrollToIndex(currentIndexArtists, 'top-artists');
  }
});

document.getElementById('scrollLeftTracks').addEventListener('click', () => {
  const container = document.getElementById('top-songs');
  if (currentIndexTracks > 0) {
    currentIndexTracks -= 1;
    scrollToIndex(currentIndexTracks, container.id);
  }
});

document.getElementById('scrollRightTracks').addEventListener('click', () => {
  const maxIndexTracks = Math.ceil(allTracks.length / scrollAmount) - 1;
  if (currentIndexTracks < maxIndexTracks) {
    currentIndexTracks += 1;
    scrollToIndex(currentIndexTracks, 'top-songs');
  }
});

function createPlaylist() {
  const accessToken = getAccessTokenFromUrl();
  if (!accessToken) {
    window.location.href = authUrl;
    return;
  }

  const playlistName = 'My Top 50';
  const playlistDescription = 'Imported from Jammly';

  fetchUserTopTracks(accessToken, currentRange)
    .then(tracks => {
      const trackUris = tracks.map(track => track.uri);

      fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
        .then(response => response.json())
        .then(data => {
          const userId = data.id;

          fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: playlistName,
              public: true
            })
          })
            .then(response => response.json())
            .then(data => {
              const playlistId = data.id;

              fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  description: playlistDescription
                })
              })
                .then(response => {
                  if (response.ok) {
                    console.log('Playlist created and description added successfully');
                  } else {
                    throw new Error('Error adding description to playlist');
                  }
                })
                .catch(error => {
                  console.error('Error adding description to playlist:', error);
                });

              fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  uris: trackUris
                })
              })
                .then(response => {
                  if (response.ok) {
                    console.log('Tracks added to playlist successfully');
                  } else {
                    throw new Error('Error adding tracks to playlist');
                  }
                })
                .catch(error => {
                  console.error('Error adding tracks to playlist:', error);
                });
            })
            .catch(error => {
              console.error('Error creating playlist:', error);
            });
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
        });
    })
    .catch(error => {
      console.error('Error fetching top tracks:', error);
    });
}

document.addEventListener("DOMContentLoaded", function() {
  document.body.classList.add("fade-in");
});



window.addEventListener("beforeunload", function() {
  document.body.classList.add("fade-out");
});





getUserStats('short_term');