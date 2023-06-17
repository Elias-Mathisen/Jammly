# Jammly

Jammly is a Spotify stats checker that allows users to view their top artists, songs, and genres from the past 4 weeks, 6 months, and year. It also allows users to create playlists based on these statistics and view their recently listened to songs.

### Color Palette

Here are the colors used in Jammly:

- ![#121212](https://via.placeholder.com/15/121212/000000?text=+) `#121212`
- ![#1DB954](https://via.placeholder.com/15/1DB954/000000?text=+) `#1DB954`
- ![#555555](https://via.placeholder.com/15/555555/000000?text=+) `#555555`
- ![#333333](https://via.placeholder.com/15/333333/000000?text=+) `#333333`
- ![#ffffff](https://via.placeholder.com/15/ffffff/000000?text=+) `#ffffff`
- ![#212121](https://via.placeholder.com/15/212121/000000?text=+) `#212121`
- ![#555](https://via.placeholder.com/15/555/000000?text=+) `#555`
- ![#999](https://via.placeholder.com/15/999/000000?text=+) `#999`

### Setup

To set up Jammly, follow these steps:

1. Clone the repository to your local machine.
2. Open the `script.js` file in the profile folder in a text editor.
3. Replace the `clientId` and `redirectUri` variables with your own Spotify API credentials. You can obtain these by creating a new Spotify app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
4. Save the `script.js` file.

### Usage

To use Jammly, follow these steps:

1. Use one of the following methods to launch the application:
   - If you are using Visual Studio Code, install the "Live Server" extension and open the `index.html` file with Live Server.
   - If you prefer a command-line approach, you can use `http-server` to start a local server. Run the following command in the terminal:
     ```
     npx http-server -p 5500
     ```
     Then, open your browser and navigate to `http://localhost:5500/`.
2. Click the "Log in" button in the top right corner of the homepage to authorize Jammly to access your Spotify account.
3. Once authorized, you will be redirected to the Jammly dashboard where you can view your top artists, songs, and genres from the past 4 weeks, 6 months, and year.
4. To create a playlist based on your statistics, click the playlist icon (three horizontal lines with a plus sign) next to the arrows that move the top songs display, and follow the prompts.
5. To view your recently listened to songs, scroll down to the bottom of the page.

### License

This project is licensed under the terms of the [MIT License](LICENSE).

Please note that in order to use Jammly, you can choose either the "Live Server" extension in Visual Studio Code or the `http-server` method. If you don't have the "Live Server" extension installed in Visual Studio Code, you can download it from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer). If you prefer the `http-server` method, you can download and install it using `npm` by running the command `npm install --global http-server`.
