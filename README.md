# Crypto News App

A React-based news app designed to fetch and display the latest crypto news from the New York Times API. The app allows users to bookmark, edit, and delete news articles. It integrates Redux for state management and localStorage for persistent data storage.

![App Screenshot](./screenshot/Screenshot.png?raw=true)

## Features

- **Fetch Crypto News**: Fetch the latest news articles related to cryptocurrency using the New York Times API.
- **Bookmark**: Save articles to a bookmark list, stored both in Redux and localStorage.
- **Edit**: Update the details of a bookmarked article, with changes saved in Redux and localStorage.
- **Delete**: Remove articles from the news feed, bookmarks, and selected news, with updates stored persistently.
- **Persistent Data**: Store bookmarks, edited news, and deleted news in localStorage, ensuring data persists across page reloads.
- **State Management**: Use Redux Toolkit for managing application state efficiently, including fetching news, bookmarking, editing, and deleting articles.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Redux Toolkit**: A modern approach to managing state in React applications.
- **Axios**: A promise-based HTTP client for making API requests.
- **New York Times API**: Provides access to a vast collection of news articles.
- **localStorage**: To persist bookmarks, edited items, and deleted items.
- **Material UI (Joy UI)**: A React component library for building modern UIs.
  
## Installation

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or later)
- [npm](https://npmjs.com/) (version 8 or later)

### Steps

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/news-app.git
    ```

2. **Navigate to the project directory**:

    ```bash
    cd news-app
    ```

3. **Install dependencies**:

    ```bash
    npm install
    ```

4. **Set up your environment variables**:

   Create a `.env` file in the project root and add your New York Times API key:

    ```plaintext
    VITE_NYT_API_KEY=your_nyt_api_key
    ```

### Running the Application

To start the application in development mode:

```bash
npm run dev
```

