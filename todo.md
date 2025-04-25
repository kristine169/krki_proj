# Flashcard Application - Development TODO Checklist

This checklist follows the phases outlined in `plan.md`. Check items off as they are completed.

---

## Phase 0: Setup & Foundation

-   **[P0-S1] Setup Project Structure:**
    -   [ ] Create monorepo or separate project folders (`backend`, `frontend`, `browser-extension`).
    -   [ ] Initialize Git repository.
    -   [ ] Create basic `README.md` in root.
-   **[P0-S2] Install Core Dependencies:**
    -   [ ] Ensure Node.js and TypeScript are installed.
    -   [ ] Initialize `package.json` in `backend`, `frontend`, `browser-extension` folders.
    -   [ ] Install base TypeScript dependencies (`typescript`, `@types/node`) in each project.
    -   [ ] Setup `tsconfig.json` for each TS project (`backend`, `frontend`, `browser-extension`).
    -   [ ] Verify `tsc` command runs successfully in each project folder.
-   **[P0-S3] Integrate & Verify Core Logic (Backend):**
    -   [ ] Copy `flashcards.ts` and `algorithms.ts` into the `backend` project structure.
    -   [ ] (Optional but Recommended) Setup a testing framework (e.g., Jest, Mocha) for the backend.
    -   [ ] Write basic unit tests for `practice()`, `update()`, `computeProgress()` in `algorithms.ts`.
    -   [ ] Ensure unit tests pass.

---

## Phase 1: Backend API Implementation

-   **[P1-S1] Basic Express Server Setup (Backend):**
    -   [ ] Install `express` and `@types/express` in `backend`.
    -   [ ] Create basic `server.ts` (or `index.ts`) that initializes Express and listens on a port.
    -   [ ] Add a simple test route (e.g., `/ping`) and verify it works via browser or `curl`.
    -   [ ] Setup `ts-node-dev` or `nodemon` for automatic server reloading during development.
-   **[P1-S2] Implement In-Memory State (Backend):**
    -   [ ] Create a backend module/service to manage application state (`BucketMap`, `history`, `currentDay`) in memory.
-   **[P1-S3] Implement Card API Endpoints (Backend):**
    -   [ ] Implement `POST /api/cards` route handler (adds card, places in Bucket 0).
    -   [ ] Implement `GET /api/cards` route handler (returns all cards).
    -   [ ] Test `POST` and `GET /api/cards` using Postman/Insomnia/curl.
-   **[P1-S4] Implement Day API Endpoints (Backend):**
    -   [ ] Implement `GET /api/day` route handler.
    -   [ ] Implement `POST /api/day/advance` route handler.
    -   [ ] Test `GET` and `POST /api/day/*` endpoints.
-   **[P1-S5] Implement Practice API Endpoints (Backend):**
    -   [ ] Implement `GET /api/practice` route handler (uses `practice()`).
    -   [ ] Implement `POST /api/practice/record` route handler (uses `update()`, adds to `history`).
    -   [ ] Test practice sequence: `GET /api/practice` -> `POST /api/practice/record` -> verify state change.
-   **[P1-S6] Implement Stats API Endpoint (Backend):**
    -   [ ] Implement `GET /api/stats` route handler (uses `computeProgress()`).
    *   [ ] Test `GET /api/stats` after recording some practice events.
-   **[P1-S7] Implement JSON File Persistence (Backend):**
    -   [ ] Define JSON file path/name (e.g., `data.json`).
    -   [ ] Implement logic to load state from JSON file on server startup (handle file not found).
    -   [ ] Implement logic to save state to JSON file after modifications (`POST /cards`, `POST /practice/record`, `POST /day/advance`).
    -   [ ] Test persistence by adding data, restarting the server, and verifying data is still present.
-   **[P1-S8] Basic API Error Handling & CORS (Backend):**
    -   [ ] Add `express.json()` and `express.urlencoded()` middleware.
    -   [ ] Add basic error handling middleware (returns structured JSON error responses).
    -   [ ] Install and configure `cors` middleware to allow requests from the Frontend origin.
    -   [ ] Test error responses (e.g., invalid requests) and check CORS headers.

---

## Phase 2: Core Frontend Implementation

-   **[P2-S1] Frontend Project Setup:**
    -   [ ] Initialize Frontend project using chosen framework/tool (Create React App, Vite, etc.).
    -   [ ] Setup TypeScript configuration if not done by the template.
    -   [ ] Ensure basic app runs (`npm start` or `npm run dev`).
-   **[P2-S2] Basic Layout & Routing (Frontend):**
    -   [ ] Create main layout components (Header, Navigation, etc.).
    -   [ ] Setup client-side routing for main views (Home/Dashboard, View Cards, Add Card, Practice, Stats).
    -   [ ] Test navigation between placeholder pages.
-   **[P2-S3] API Client Module (Frontend):**
    -   [ ] Create a module (`src/services/api.ts` or similar) to handle API calls.
    -   [ ] Implement functions for each backend endpoint (`getCards`, `addCard`, `getDay`, etc.).
    -   [ ] Configure base URL for the backend API.
    -   [ ] Test a simple API call (e.g., `getDay()`) from the frontend.
-   **[P2-S4] View All Cards Component (Frontend):**
    -   [ ] Create a component/page for viewing cards.
    -   [ ] Fetch card data using the API client (`GET /api/cards`) on component mount.
    -   [ ] Display the fetched cards in a list or table format.
    -   [ ] Test by viewing cards added via the backend API tester.
-   **[P2-S5] Add New Card Component (Frontend):**
    -   [ ] Create a component/page with a form for `front`, `back`, `hint`, `tags`.
    -   [ ] Implement form submission logic to call the API client (`POST /api/cards`).
    -   [ ] Display success/error feedback to the user.
    -   [ ] Test adding a card via the frontend form and verifying it appears in the 'View Cards' list.

---

## Phase 3: Practice Session Implementation (Frontend)

-   **[P3-S1] Practice Session Component Structure (Frontend):**
    -   [ ] Create the main component/page for the practice session UI.
    -   [ ] Add a "Start Practice" button (e.g., on the Home/Dashboard).
-   **[P3-S2] Fetch Practice Cards (Frontend):**
    -   [ ] Implement logic to fetch cards for the day (`GET /api/practice`) when "Start Practice" is clicked.
    -   [ ] Store the practice card set in the component's state.
    -   [ ] Handle the case where no cards are due (display a message).
    -   [ ] Test fetching practice cards.
-   **[P3-S3] Display Card (Front -> Hint -> Back) (Frontend):**
    -   [ ] Display the `front` of the current card from the practice set.
    -   [ ] Implement a "Show Hint" button/action (display `hint` if available).
    -   [ ] Implement a "Show Back" button/action (display `back`).
    -   [ ] Manage component state to track current card index and visibility state (front/hint/back).
    -   [ ] Test card display flow.
-   **[P3-S4] Implement Difficulty Buttons (Frontend):**
    -   [ ] Display "Wrong", "Hard", "Easy" buttons after the back of the card is revealed.
    -   [ ] Test button visibility logic.
-   **[P3-S5] Record Practice Result & Advance (Frontend):**
    -   [ ] Add event handlers to difficulty buttons.
    -   [ ] On click, call the API client (`POST /api/practice/record`) with card identifiers and difficulty.
    -   [ ] Advance to the next card in the practice set.
    -   [ ] Handle the end of the session (e.g., show completion message, navigate away).
    -   [ ] Test completing a full practice session using buttons.
-   **[P3-S6] Implement Advance Day Button (Frontend):**
    -   [ ] Add an "Advance Day" button (e.g., on dashboard or settings).
    -   [ ] Implement button click handler to call `POST /api/day/advance`.
    -   [ ] Provide user feedback on success/failure.
    -   [ ] Test advancing the day from the frontend.

---

## Phase 4: Browser Extension Development

-   **[P4-S1] Basic Extension Setup:**
    -   [ ] Create `manifest.json` (v3 recommended) with necessary permissions (`contextMenus`, `storage`, `scripting`/`activeTab`, host permissions for API).
    -   [ ] Create a background service worker script (`background.js`).
    -   [ ] Create a basic `options.html` page.
    -   [ ] Load the unpacked extension into the browser and verify it loads without manifest errors.
-   **[P4-S2] Context Menu Implementation:**
    -   [ ] In `background.js`, register the context menu item ("Add to Flashcards") on installation (`chrome.runtime.onInstalled`). Set context to `selection`.
    -   [ ] Add listener for `chrome.contextMenus.onClicked`.
    -   [ ] Test context menu appears on text selection and click logs info to service worker console.
-   **[P4-S3] Capture Text & Prompt User:**
    -   [ ] In the `onClicked` listener, retrieve `selectionText`.
    -   [ ] Implement logic to open a popup or inject a content script/modal to prompt the user for the other side of the card (confirming front/back, entering the other side, optional hint/tags).
    -   [ ] Test capturing text and displaying the prompt.
-   **[P4-S4] Implement API Call & Configuration:**
    -   [ ] Implement the `options.html` page UI to input and save the Backend API URL using `chrome.storage`.
    -   [ ] In the prompt/popup logic, retrieve the saved API URL from `chrome.storage`.
    -   [ ] Implement the `fetch` call to `POST /api/cards` using the collected card data and API URL.
    -   [ ] Add user feedback (success/error notification or message in popup).
    -   [ ] Test configuring the API URL, adding a card via the extension, and verifying it in the backend/frontend.

---

## Phase 5: Hand Gesture Integration (Frontend)

-   **[P5-S1] Add Hand Pose Library:**
    -   [ ] Install TensorFlow.js (`@tensorflow/tfjs`) and the hand detection model (`@tensorflow-models/hand-pose-detection` or `@mediapipe/hands`).
    -   [ ] Verify basic TFJS operation in the frontend project.
-   **[P5-S2] Create Hand Gesture Component (Frontend):**
    -   [ ] Create a new component (`HandGestureInput.tsx` or similar).
    -   [ ] Implement `navigator.mediaDevices.getUserMedia` to request webcam access.
    -   [ ] Handle success (stream received) and error (permission denied, no device).
    -   [ ] Add a `<video>` element to display the webcam feed (can be hidden later).
    -   [ ] Test webcam access request and video display.
-   **[P5-S3] Integrate Hand Pose Detection:**
    -   [ ] Load the hand pose detection model (e.g., MediaPipe Hands).
    -   [ ] Create a loop (e.g., using `requestAnimationFrame`) to get video frames and pass them to the model for detection.
    -   [ ] (Optional) Draw detected landmarks onto a canvas overlaying the video for debugging.
    -   [ ] Test hand landmark detection in the component.
-   **[P5-S4] Implement Basic Gesture Recognition:**
    -   [ ] Define logic or use a library (like `fingerpose`) to recognize specific gestures (Thumbs Up, Thumbs Down, Flat Hand) from the landmarks.
    -   [ ] Map recognized gestures to `AnswerDifficulty` enum values.
    -   [ ] Implement debouncing/thresholding for stable recognition.
    -   [ ] Test gesture recognition logic (e.g., log recognized gestures to console).
-   **[P5-S5] Integrate with Practice Component:**
    -   [ ] Add a toggle button/switch in the Practice Session UI to enable/disable the `HandGestureInput` component.
    -   [ ] Pass a callback function from the Practice component to `HandGestureInput`.
    -   [ ] When `HandGestureInput` recognizes a gesture, invoke the callback with the corresponding `AnswerDifficulty`.
    -   [ ] Update the Practice component to handle difficulty input received via this callback.
    -   [ ] Ensure webcam resources are properly released when the gesture component is inactive or unmounted.
    -   [ ] Test answering flashcards using hand gestures during a practice session.
-   **[P5-S6] Add Visual Feedback for Gestures:**
    -   [ ] In the Practice UI, add elements to display the status: Gesture input inactive/active, Hand detected, Gesture recognized (e.g., show an icon).
    -   [ ] Update the feedback elements based on the state of the `HandGestureInput` component.
    -   [ ] Test visual feedback accurately reflects the detection status.

---

## Phase 6: Refinement & Testing

-   **[P6-S1] Implement Stats Display (Frontend):**
    -   [ ] Create a Stats component/page.
    -   [ ] Fetch statistics using the API client (`GET /api/stats`).
    -   [ ] Display the statistics clearly (total cards, cards per bucket, success rate, etc.).
    -   [ ] Test stats display reflects data from practice sessions.
-   **[P6-S2] Comprehensive Error Handling:**
    -   [ ] Review Backend API for potential errors (validation, edge cases) and add robust handling.
    -   [ ] Review Frontend for API call errors, gesture module errors (webcam, model loading), and provide clear user feedback.
    -   [ ] Review Browser Extension for API call errors, storage errors, permission issues and add handling.
    -   [ ] Test various error scenarios manually.
-   **[P6-S3] Cross-Component Testing (E2E):**
    -   [ ] Perform end-to-end test: Add card (Extension) -> Practice (Frontend Buttons) -> Check Stats (Frontend).
    -   [ ] Perform end-to-end test: Add card (Frontend) -> Practice (Frontend Gestures) -> Check Stats (Frontend).
    -   [ ] Perform end-to-end test: Verify data persistence across backend restarts.
-   **[P6-S4] UI/UX Refinement:**
    -   [ ] Review and improve application styling and layout.
    *   [ ] Ensure consistent user experience across different parts of the application.
    *   [ ] Test responsiveness if applicable.
-   **[P6-S5] Code Cleanup & Documentation:**
    *   [ ] Refactor code for clarity, remove unused code/console logs.
    *   [ ] Add comments to complex sections of code.
    *   [ ] Update `README.md` files for `backend`, `frontend`, `browser-extension` with setup and usage instructions.
-   **[P6-S6] Final Testing:**
    -   [ ] Test Frontend and Extension functionality in target browsers (e.g., Chrome, Firefox).
    -   [ ] Perform basic performance check on gesture detection.
    -   [ ] Final review against `spec.md` requirements.

---
