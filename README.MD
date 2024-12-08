# 🚀 Getting Started with the React Native Expo App

Welcome! This guide will help you set up and run the React Native Expo app. Don’t worry if you’re not familiar with web development—just follow these instructions, and you’ll have the app running in no time!

## 📋 Table of Contents

1. [Install Required Software](#1-install-required-software)
    - [a. Install Node.js](#a-install-nodejs)
    - [b. Install Git](#b-install-git)
    - [c. Install WebStorm (Optional but Recommended)](#c-install-webstorm-optional-but-recommended)
2. [Clone the Git Repository](#2-clone-the-git-repository)
3. [Install Project Dependencies](#3-install-project-dependencies)
4. [Start the Expo Application](#4-start-the-expo-application)
    - [a. Run in Web Browser](#a-run-in-web-browser)
    - [b. Run on Android Emulator (Optional)](#b-run-on-android-emulator-optional)
5. [View the App on Your Phone (Optional)](#5-view-the-app-on-your-phone-optional)
6. [🔧 Troubleshooting Tips](#6-troubleshooting-tips)
7. [❓ Need Help?](#7-need-help)

---

## 1. Install Required Software

### a. Install Node.js

1. **Download Node.js:**
    - Go to the [Node.js official website](https://nodejs.org/).
    - Click on the **LTS (Long Term Support)** version to download.

2. **Install Node.js:**
    - Open the downloaded installer.
    - Follow the on-screen instructions to complete the installation.

### b. Install Git

1. **Download Git:**
    - Visit the [Git official website](https://git-scm.com/downloads).
    - Choose the version compatible with your operating system.

2. **Install Git:**
    - Run the installer you downloaded.
    - Follow the installation prompts, keeping the default settings unless you have specific preferences.

### c. Install WebStorm (Optional but Recommended)

1. **Download WebStorm:**
    - Go to the [WebStorm website](https://www.jetbrains.com/webstorm/download/).
    - Choose the appropriate version for your OS and download it.

2. **Install WebStorm:**
    - Open the downloaded installer.
    - Follow the installation steps to set it up on your computer.

---

## 2. Clone the Git Repository

1. **Open WebStorm:**
    - Launch WebStorm from your applications menu.

2. **Clone the Repository:**
    - In WebStorm, navigate to **File > New > Project from Version Control**.
    - Select **Git** from the options.
    - In the **URL** field, enter:
      ```
      https://github.com/emreutkan/testest
      ```
    - Choose a **Directory** on your computer where you want to save the project.
    - Click **Clone**.

   **Alternatively, you can use Git Bash or your terminal:**

    - Open **Git Bash** or **Terminal**.
    - Navigate to the folder where you want to clone the repo using:
      ```bash
      cd path/to/folder
      ```
    - Run the command:
      ```bash
      git clone https://github.com/emreutkan/testest
      ```

---

## 3. Install Project Dependencies

1. **Open the Project in WebStorm:**
    - If you cloned via WebStorm, it should already be open.
    - If not, go to **File > Open** and select the cloned `testest` folder.

2. **Open the Terminal:**
    - Inside WebStorm, locate the **Terminal** at the bottom of the window.
    - *Alternatively, you can open your system’s Terminal and navigate to the project folder.*

3. **Run `npm install`:**
    - In the terminal, type the following command and press **Enter**:
      ```bash
      npm install
      ```
    - This command installs all the necessary packages required for the project.

---

## 4. Start the Expo Application

### a. Run in Web Browser
1. **Run Expo:**
    - In the terminal, type the following command and press **Enter**:
      ```bash
      npx expo start
      ```
    - This will start the Expo development server.

2. **Open in Web Browser:**
    - After the server starts, press the **`w`** key in the terminal.
    - This will open the app in your default web browser.
3. **Emulate iPhone 12 Pro:**
    - In the web browser, press **F12** to open Developer Tools.
    - Locate the **Device Toolbar** icon (usually looks like a phone/tablet) or press `Ctrl+Shift+M` (Windows) / `Cmd+Shift+M` (Mac).
    - From the device list, select **iPhone 12 Pro** to emulate the device dimensions.
### b. Run on Android Emulator (Optional)
*If you prefer to run the app on an Android emulator, follow these steps. Note that setting up Android Studio and environment variables requires additional steps and tutorials, which are beyond the scope of this guide.*
1. **Install Android Studio:**
    - Download from the [Android Studio website](https://developer.android.com/studio).
    - Follow the installation instructions provided there.
2. **Set Up Android Emulator:**
    - Open Android Studio.
    - Use the **AVD Manager** to create and start an Android Virtual Device.
3. **Run the App on Emulator:**
    - With the emulator running, return to your terminal.
    - Ensure the Expo server is running (`npx expo start`).
    - Press **`a`** in the terminal to launch the app on the Android emulator.
      *For detailed instructions on setting up Android Studio and configuring environment variables, please refer to online tutorials or official documentation.*

---

## 5. View the App on Your Phone (Optional)

1. **Install Expo Go:**
    - On your smartphone, go to the App Store (iOS) or Google Play Store (Android).
    - Search for **Expo Go** and install the app.

2. **Connect Your Phone:**
    - Ensure your phone is connected to the same Wi-Fi network as your computer.
    - Open **Expo Go** on your phone.
    - Use the app to scan the QR code displayed in the terminal or Expo Dev Tools.

3. **Run the App:**
    - After scanning, the app will load on your phone, and you can interact with it directly.

---

## 🔧 Troubleshooting Tips

- **Ensure All Software is Properly Installed:**
    - Double-check that Node.js and Git are correctly installed by running the following commands in your terminal:
      ```bash
      node -v
      git --version
      ```
    - You should see version numbers displayed.

- **Check Internet Connection:**
    - A stable internet connection is required to download dependencies and for Expo to communicate with your phone or emulator.

- **Firewall and Antivirus:**
    - Sometimes, firewall or antivirus settings can block connections. Ensure that they allow Node.js and Git to operate.

- **Restart if Needed:**
    - If you encounter issues, try restarting WebStorm and your terminal, then repeat the steps.

- **Running on Android Emulator Issues:**
    - If you choose to use an Android emulator and face issues, refer to Android Studio's official documentation or online tutorials for setup and troubleshooting.
---
## ❓ Need Help?
If you run into any issues or have questions, feel free to reach out to me, and I’ll be happy to assist you!
---
🎉 **Enjoy exploring the app!**
---
# License
[MIT](LICENSE)
# Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements.
---
# Contact
For any questions or feedback, please contact [emreutkan](https://github.com/emreutkan).
---
*Happy Coding!*