# Flashcard Application - Development Plan (plan.md)

## 1. Overview

This document outlines the development plan for the integrated Flashcard Application System, including the Backend, Frontend, Browser Extension, and Hand Gesture Module. The plan follows an iterative approach, prioritizing core functionality and building complexity incrementally. Each phase aims to deliver testable components or features.

## 2. Methodology

*   **Iterative Development:** Build the system in small, incremental phases.
*   **Component-Based:** Develop major components (Backend API, Frontend, Extension, Gesture Module) somewhat independently once the core API is defined.
*   **Test-Driven (where practical):** Write unit tests for core logic (algorithms, API handlers) and integration tests for component interactions. Manual testing is crucial for UI/UX and gesture recognition.
*   **Prioritization:** Focus on establishing the Backend API first, followed by the core Frontend practice loop, then the extensions.

## 3. Tooling

*   **Version Control:** Git (e.g., GitHub, GitLab)
*   **Project Management:** Trello, Jira, or simple Markdown checklists (like this plan).
*   **Code Editor:** VS Code (recommended)
*   **Backend:** Node.js, TypeScript, Express.js, `ts-node-dev` or `nodemon`
*   **Frontend:** Node.js (for build tools), TypeScript, React/Vue/Svelte/Angular, CSS framework (optional)
*   **Browser Extension:** WebExtension APIs, JavaScript/TypeScript
*   **Hand Gestures:** TensorFlow.js (@tensorflow/tfjs, @tensorflow-models/hand-pose-detection or @mediapipe/hands)
*   **API Testing:** Postman, Insomnia, or `curl`
*   **Package Management:** npm or yarn
*   **Linting/Formatting:** ESLint, Prettier

## 4. Development Phases & Steps

---

### Phase 0: Setup & Foundation (Estimate: 0.5 - 1 day)

*Goal: Prepare the development environment and verify core logic.*

1.  **[P0-S1] Setup Project Structure:**
    *   Create a monorepo (optional but recommended) or separate project folders (`backend`, `frontend`, `browser-extension`).
    *   Initialize Git repository.
    *   Setup basic `README.md`.
    *   *Test:* Folders exist, Git repo initialized.
2.  **[P0-S2] Install Core Dependencies:**
    *   Install Node.js, TypeScript globally or via NVM.
    *   Initialize `package.json` and install base dependencies (`typescript`, `@types/node`) in relevant folders.
    *   Setup `tsconfig.json` for each TypeScript project.
    *   *Test:* `tsc` command runs successfully in each project.
3.  **[P0-S3] Integrate & Verify Core Logic (Backend):**
    *   Place `flashcards.ts` and `algorithms.ts` into the `backend` project.
    *   Create basic unit tests for key functions in `algorithms.ts` (`practice`, `update`, `computeProgress`). Ensure they pass.
    *   *Test:* Unit tests pass using a test runner (e.g., Jest, Mocha).

---

### Phase 1: Backend API Implementation (Estimate: 2 - 4 days)

*Goal: Create a functional Backend API with basic persistence.*

1.  **[P1-S1] Basic Express Server Setup (Backend):**
    *   Install Express (`express`, `@types/express`).
    *   Create a basic server file (`server.ts` or `index.ts`) that listens on a port.
    *   Setup `ts-node-dev` or `nodemon` for auto-reloading.
    *   *Test:* Server starts and responds to a simple test route (e.g., `/ping`).
2.  **[P1-S2] Implement In-Memory State (Backend):**
    *   Create a module to manage application state (`BucketMap`, `history`, `currentDay`) *in memory* initially (e.g., using `Map`, `Set`, `Array`).
    *   *Test:* State can be initialized and modified internally (prep for API).
3.  **[P1-S3] Implement Card API Endpoints (Backend):**
    *   `POST /api/cards`: Implement route handler using `update()` (implicitly adding to Bucket 0). (FR-BE.3)
    *   `GET /api/cards`: Implement route handler to return all cards from the in-memory state. (FR-BE.3)
    *   *Test:* Use Postman/Insomnia to add and retrieve cards. Verify responses.
4.  **[P1-S4] Implement Day API Endpoints (Backend):**
    *   `GET /api/day`, `POST /api/day/advance`: Implement route handlers to get/increment `currentDay`. (FR-BE.3)
    *   *Test:* Use Postman/Insomnia to check and advance the day.
5.  **[P1-S5] Implement Practice API Endpoints (Backend):**
    *   `GET /api/practice`: Implement route using `practice()` on the current state. (FR-BE.3)
    *   `POST /api/practice/record`: Implement route using `update()` and adding to `history`. (FR-BE.3)
    *   *Test:* Add cards, advance day, use Postman to get practice set, simulate answers, verify bucket changes and history updates.
6.  **[P1-S6] Implement Stats API Endpoint (Backend):**
    *   `GET /api/stats`: Implement route using `computeProgress()`. (FR-BE.3)
    *   *Test:* Use Postman after some practice records exist, verify stats response.
7.  **[P1-S7] Implement JSON File Persistence (Backend):**
    *   Refactor state management to load from a JSON file on startup and save state after modifications (e.g., after `POST /api/cards`, `POST /api/practice/record`, `POST /api/day/advance`). (FR-BE.2)
    *   Handle file not found on initial startup.
    *   *Test:* Stop/start server, verify data persists. Check JSON file content.
8.  **[P1-S8] Basic API Error Handling & CORS (Backend):**
    *   Add basic middleware for JSON body parsing and URL encoding.
    *   Add basic error handling middleware (return 400/500 with JSON error messages). (FR-BE.5)
    *   Add CORS middleware (`cors` package) to allow requests from the Frontend origin (e.g., `localhost:3000`). (NFR8)
    *   *Test:* Test invalid requests, check CORS headers in responses.

---

### Phase 2: Core Frontend Implementation (Estimate: 2 - 3 days)

*Goal: Setup Frontend project and implement basic card viewing/adding.*

1.  **[P2-S1] Frontend Project Setup:**
    *   Choose framework (e.g., `create-react-app`, `vite` with Vue/React/Svelte template).
    *   Setup basic project structure, TypeScript configuration.
    *   *Test:* Basic app runs in the browser (`npm start` or `npm run dev`).
2.  **[P2-S2] Basic Layout & Routing (Frontend):**
    *   Create main layout components (Header, Footer, Content Area).
    *   Setup basic client-side routing (if using SPA framework) for different views (Home, View Cards, Add Card, Practice).
    *   *Test:* Navigate between placeholder pages.
3.  **[P2-S3] API Client Module (Frontend):**
    *   Create a module (`api.ts` or similar) with functions to make requests to the Backend API endpoints (using `fetch` or `axios`). Handle base URL configuration.
    *   *Test:* Can call a simple backend endpoint (e.g., `/ping` or `GET /api/day`) from the browser console.
4.  **[P2-S4] View All Cards Component (Frontend):**
    *   Create a component that fetches cards using the API client (`GET /api/cards`) on mount. (FR-FE.1)
    *   Display cards in a list or table.
    *   *Test:* Add cards via API tester, verify they appear in the frontend component.
5.  **[P2-S5] Add New Card Component (Frontend):**
    *   Create a component with a form for `front`, `back`, `hint`, `tags`. (FR-FE.2)
    *   On submit, call the API client (`POST /api/cards`).
    *   Provide user feedback (success/error message).
    *   *Test:* Add a card via the form, verify it appears in the "View All Cards" component.

---

### Phase 3: Practice Session Implementation (Frontend) (Estimate: 2 - 4 days)

*Goal: Implement the core practice loop in the Frontend using button input.*

1.  **[P3-S1] Practice Session Component Structure (Frontend):**
    *   Create the main component for the practice session UI.
    *   Add a "Start Practice" button on the Home/Dashboard page.
    *   *Test:* Button exists.
2.  **[P3-S2] Fetch Practice Cards (Frontend):**
    *   On "Start Practice" click, fetch the day's cards using the API client (`GET /api/practice`). (FR-FE.3)
    *   Store the fetched cards in the component's state. Handle the case where no cards are due.
    *   *Test:* Add cards via API tester, set day appropriately, click button, check network request and component state via dev tools.
3.  **[P3-S3] Display Card (Front -> Hint -> Back) (Frontend):**
    *   Display the front of the current card.
    *   Implement "Show Hint" button (if hint exists). (FR-FE.3 related)
    *   Implement "Show Back" button. Reveal the back text.
    *   Manage the state for current card index and visibility (front/hint/back shown).
    *   *Test:* Cycle through showing front/hint/back for a sample card.
4.  **[P3-S4] Implement Difficulty Buttons (Frontend):**
    *   After showing the back, display "Wrong", "Hard", "Easy" buttons. (FR-FE.4, FR-FE.5 - button part)
    *   *Test:* Buttons appear at the correct time.
5.  **[P3-S5] Record Practice Result & Advance (Frontend):**
    *   On difficulty button click:
        *   Call the API client (`POST /api/practice/record`) with card details and chosen difficulty. (FR-FE.6)
        *   Advance to the next card in the practice set.
        *   Handle the end of the session (all cards reviewed).
    *   *Test:* Complete a practice session with multiple cards, verify state updates in Backend (via API tester or logs).
6.  **[P3-S6] Implement Advance Day Button (Frontend):**
    *   Add a button (e.g., on dashboard) to call `POST /api/day/advance`. (FR-FE.10)
    *   Provide feedback.
    *   *Test:* Click button, verify day increments in backend (via `GET /api/day`).

---

### Phase 4: Browser Extension Development (Estimate: 2 - 3 days)

*Goal: Create the extension to capture text and add cards.*

1.  **[P4-S1] Basic Extension Setup:**
    *   Create `manifest.json` (v3 recommended) requesting `contextMenus`, `storage`, `scripting` (or `activeTab`), and host permissions for the API endpoint.
    *   Create a background service worker (`background.js`).
    *   *Test:* Extension loads into the browser without errors.
2.  **[P4-S2] Context Menu Implementation:**
    *   In `background.js`, use `chrome.runtime.onInstalled` to create the context menu item ("Add to Flashcards") for text selections. (FR-EXT.1)
    *   Add a listener for `chrome.contextMenus.onClicked`.
    *   *Test:* Context menu appears when selecting text on a webpage. Clicking it logs something in the service worker console.
3.  **[P4-S3] Capture Text & Prompt User:**
    *   When the context menu is clicked, get the `selectionText`. (FR-EXT.2)
    *   Use `chrome.windows.create` or `chrome.scripting.executeScript` with a content script to open a simple form/popup prompting for the other side of the card and confirming front/back assignment. (FR-EXT.3)
    *   *Test:* Selecting text and clicking menu item opens a prompt/popup showing the selected text.
4.  **[P4-S4] Implement API Call & Configuration:**
    *   Create an options page (`options.html`) for the user to input the Backend API URL. Save/load using `chrome.storage.sync` or `local`. (FR-EXT.4)
    *   In the background script or popup logic, retrieve the saved API URL.
    *   Implement the `fetch` call to `POST /api/cards` with the card data collected from the user. (FR-EXT.5)
    *   Provide feedback (e.g., `alert`, `chrome.notifications`). (FR-EXT.6)
    *   *Test:* Configure API URL, select text, use the extension to add a card, verify card appears in Frontend/Backend. Test error case (invalid API URL).

---

### Phase 5: Hand Gesture Integration (Frontend) (Estimate: 3 - 5 days)

*Goal: Integrate webcam-based gesture input into the practice session.*

1.  **[P5-S1] Add Hand Pose Library:**
    *   Install TensorFlow.js and MediaPipe Hands/Hand Pose Detection model dependencies into the Frontend project.
    *   *Test:* Dependencies install, basic TFJS operation works (e.g., `tf.tensor`).
2.  **[P5-S2] Create Hand Gesture Component (Frontend):**
    *   Create a new component (`HandGestureInput` or similar).
    *   Implement webcam access using `navigator.mediaDevices.getUserMedia`. Handle permissions request and errors. (FR-HGM.2)
    *   Display the video feed in the component (optional but good for debugging).
    *   *Test:* Component renders, requests webcam access, shows video feed (if displayed).
3.  **[P5-S3] Integrate Hand Pose Detection:**
    *   Load the hand pose model.
    *   Process video frames using the model to detect hand landmarks. (FR-HGM.3)
    *   Draw landmarks on the video feed/canvas for visual feedback (debugging).
    *   *Test:* Landmarks are detected and drawn accurately on the user's hand in the video feed.
4.  **[P5-S4] Implement Basic Gesture Recognition:**
    *   Define simple logic based on landmark positions to recognize Thumbs Up, Thumbs Down, Flat Hand. (Consider using `fingerpose` library for easier definition). (FR-HGM.4)
    *   Add debouncing or thresholding (gesture must be held briefly) to avoid spurious inputs.
    *   *Test:* Console log recognized gestures as they happen. Test accuracy under different conditions.
5.  **[P5-S5] Integrate with Practice Component:**
    *   Add a toggle button in the Practice Session UI to activate/deactivate the `HandGestureInput` component. (FR-FE.8)
    *   Pass a callback function from Practice component to `HandGestureInput`. When a gesture is confidently recognized, the callback is invoked with the corresponding `AnswerDifficulty`. (FR-HGM.5)
    *   Modify Practice component logic to accept input from this callback (in addition to buttons). (FR-FE.5 - gesture part)
    *   Ensure webcam is released when component is deactivated or unmounted. (FR-HGM.7)
    *   *Test:* Use gestures to answer cards during a practice session. Verify correct `AnswerDifficulty` is recorded.
6.  **[P5-S6] Add Visual Feedback for Gestures:**
    *   In the Practice UI, display the status (Inactive, Searching, Hand Detected, Gesture Recognized [e.g., show 👍]). (FR-HGM.6)
    *   *Test:* UI feedback accurately reflects the state of the gesture detection.

---

### Phase 6: Refinement & Testing (Estimate: 2 - 4 days)

*Goal: Polish features, improve robustness, and perform final testing.*

1.  **[P6-S1] Implement Stats Display (Frontend):**
    *   Create a Stats component/page.
    *   Fetch data using `GET /api/stats` and display it clearly (total cards, cards/bucket, success rate etc.). (FR-FE.7)
    *   *Test:* Perform practice sessions, verify stats display updates correctly.
2.  **[P6-S2] Comprehensive Error Handling:**
    *   Review and improve error handling in Backend API (edge cases, validation).
    *   Improve error handling in Frontend (API failures, gesture module errors). (FR-FE.9, FR-HGM.8)
    *   Improve error handling in Browser Extension (API failures, permission errors). (FR-EXT.6)
    *   *Test:* Manually trigger error conditions (stop backend, deny webcam, invalid input).
3.  **[P6-S3] Cross-Component Testing (E2E):**
    *   Perform end-to-end tests:
        *   Add card via Extension -> Practice card in Frontend using Buttons -> Check Stats.
        *   Add card via Frontend -> Practice card using Gestures -> Check Stats.
        *   Verify persistence across backend restarts.
4.  **[P6-S4] UI/UX Refinement:**
    *   Improve layout, styling, and user flow based on testing.
    *   Ensure consistent design across components (where applicable).
5.  **[P6-S5] Code Cleanup & Documentation:**
    *   Refactor code for clarity and maintainability.
    *   Add code comments where necessary.
    *   Update `README.md` files for each component with setup and usage instructions.
6.  **[P6-S6] Final Testing:**
    *   Cross-browser testing (Frontend, Extension) on target browsers (Chrome, Firefox). (NFR7)
    *   Performance check for gesture module. (NFR4)

---

## 5. Assumptions & Risks

*   **Assumption:** User has a working webcam and grants permission for gesture input.
*   **Assumption:** User has a modern browser supporting necessary Web APIs.
*   **Assumption:** Backend API is accessible from the Browser Extension and Frontend (consider CORS, network).
*   **Risk:** Hand gesture recognition accuracy may vary significantly based on lighting, background, webcam quality, and individual hand shapes. May require significant tuning or simplification of gestures. (High Risk)
*   **Risk:** Performance impact of hand pose detection on lower-end machines. (Medium Risk)
*   **Risk:** Complexity of managing state across multiple asynchronous components (Backend, Frontend, Extension). (Medium Risk)
*   **Risk:** Cross-browser compatibility issues, especially for WebExtension APIs and `getUserMedia`. (Medium Risk)
*   **Risk:** Time estimates are rough and may need adjustment based on encountered issues.

## 6. Post-Development

*   Consider packaging/deployment strategies (Docker for backend, build process for frontend, publishing extension).
*   Gather user feedback for future iterations.