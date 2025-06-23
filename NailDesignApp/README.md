# Nailder - The Nail Design Discovery Platform

![Nailder App Banner](src/assets/placeholder-nail.png)

## 📖 Table of Contents

- [About The Project](#about-the-project)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [📁 Project Structure](#-project-structure)
- [📜 Available Scripts](#-available-scripts)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)

## 📍 About The Project

**Nailder** is a mobile application designed to bridge the gap between nail art enthusiasts and talented nail technicians. It serves as a discovery platform where users can browse an endless feed of nail designs, find inspiration, and connect directly with the technicians who can bring those designs to life.

The app addresses the challenge of finding skilled nail technicians who specialize in specific styles. For technicians, it provides a platform to showcase their portfolio, attract new clients, and manage their work.

---

## ✨ Features

- **💅 Dual User Roles**: Separate interfaces and functionalities for **Customers** and **Technicians**.
- **🔑 Secure Authentication**: Full authentication flow (Sign Up, Login, Forgot Password) using AWS Cognito.
- **🎨 Infinite Design Feed**: Customers can swipe through an endless, Tinder-like feed of nail designs.
- **❤️ Like & Save Designs**: Save favorite designs for future reference.
- **🔍 Advanced Search**: Robust search functionality to find designs and technicians based on keywords, styles, and location.
- **👤 Technician Profiles**: Detailed profiles for technicians showcasing their bio, specialties, portfolio, and ratings.
- **💬 In-App Chat**: Seamless communication between customers and technicians to discuss designs and book appointments.
- **🖼️ Design Upload**: Technicians can easily upload new designs to their portfolio with images, titles, descriptions, and tags.
- **📱 Profile Management**: Users can view and edit their profiles.

---

## 🛠️ Tech Stack

This project is built with a modern mobile development stack:

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) & React Context
- **Backend Services**: [AWS Amplify](https://aws.amazon.com/amplify/)
  - **Authentication**: Amazon Cognito
  - **API**: AWS AppSync (GraphQL) & API Gateway (REST)
  - **Storage**: Amazon S3 for image uploads
- **GraphQL Client**: [Apollo Client](https://www.apollographql.com/docs/react/)
- **Navigation**: [React Navigation](https://reactnavigation.org/)
- **UI & Styling**:
  - React Native core components
  - `expo-linear-gradient` for gradients
  - `react-native-gesture-handler` & `react-native-reanimated` for complex gestures and animations

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- **Node.js**: `v18.x` or newer
- **npm** or **yarn**
- **Expo Go** app on your iOS or Android device for development, or a configured emulator/simulator.
- **AWS Amplify CLI**:
  ```bash
  npm install -g @aws-amplify/cli
  ```

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd NailDesignApp
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up AWS Amplify:**
    - Initialize Amplify in your project (if not already done):
      ```bash
      amplify init
      ```
    - Deploy the backend resources:
      ```bash
      amplify push
      ```
    This command will provision the necessary AWS resources (Cognito, AppSync, S3, etc.) and create an `aws-exports.js` file in your root directory.

### Configuration

The project requires environment variables for connecting to the backend.

1.  **Create an environment file:**
    Create a file named `.env` in the root of the project.

2.  **Add environment variables:**
    Add the following variables to your `.env` file, replacing the placeholder values with your actual backend endpoints.

    ```env
    EXPO_PUBLIC_API_BASE_URL="https://your-api-gateway-endpoint.com"
    EXPO_PUBLIC_GRAPHQL_ENDPOINT="https://your-appsync-graphql-endpoint.amazonaws.com/graphql"
    ```

    - `EXPO_PUBLIC_API_BASE_URL`: The base URL for your REST API endpoints.
    - `EXPO_PUBLIC_GRAPHQL_ENDPOINT`: The full URL for your AWS AppSync GraphQL API.

    These variables are loaded automatically by Expo.

---

## 📁 Project Structure

The `src` directory is organized to maintain a clean and scalable architecture.

```
src/
├── assets/          # Static assets like images and fonts
├── aws/             # AWS Amplify configuration setup
├── components/      # Reusable UI components, organized by feature
├── constants/       # App-wide constants (e.g., colors, styles, keys)
├── context/         # React Context providers for global state
├── graphql/         # GraphQL queries, mutations, and Apollo Client setup
├── hooks/           # Custom React hooks for business logic
├── navigation/      # Navigation stack and routing logic
├── screens/         # Top-level screen components, organized by user role
├── services/        # API calls and other external services
├── store/           # Zustand stores for state management
├── styles/          # Global and shared style sheets
└── utils/           # Helper functions and utilities
```

---

## 📜 Available Scripts

In the project directory, you can run:

-   `npm start`: Runs the app in development mode with Expo.
-   `npm run android`: Runs the app on a connected Android device or emulator.
-   `npm run ios`: Runs the app on the iOS simulator.
-   `npm run web`: Runs the app in a web browser.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

---

## 📝 License

This project is licensed under the MIT License. See the `LICENSE` file for details. 