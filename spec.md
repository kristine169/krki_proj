## 1. Overview

This document specifies the requirements for an enhanced flashcard application system designed to facilitate efficient learning using spaced repetition. The system comprises several interconnected components:

1.  **Backend Service:** Manages flashcard data, implements the Modified-Leitner spaced repetition algorithm (based on `flashcards.ts` and `algorithms.ts`), handles persistence, and exposes a data API.
2.  **Frontend Web Application:** Provides the main user interface for managing cards, conducting practice sessions, and viewing statistics. It interacts with the Backend via its API.
3.  **Browser Extension:** Allows users to quickly create new flashcards based on text selected while browsing the web.
4.  **Hand Gesture Input Module:** Integrates with the Frontend to allow users to rate flashcard difficulty during practice sessions using webcam-based hand pose detection instead of traditional input methods.

The core learning logic relies on the Modified-Leitner system as defined in the initial code (`flashcards.ts`, `algorithms.ts`).

## 2. Goals

*   Implement a robust backend service for flashcard management and spaced repetition logic.
*   Develop an intuitive frontend web application for user interaction.
*   Enable seamless addition of new flashcards directly from web browsing via a Browser Extension.
*   Provide an alternative, hands-free input method for rating card difficulty using Hand Gestures via webcam.
*   Ensure efficient learning through the Modified-Leitner spaced repetition algorithm.
*   Persist user data (cards, progress, history) reliably.
*   Provide users with clear feedback on their learning progress.

## 3. Scope

### In Scope:

*   **Backend:**
    *   All features defined by `flashcards.ts` and `algorithms.ts`.
    *   Exposing a RESTful API (or similar, e.g., WebSockets) for data access and operations.
    *   Data persistence (e.g., JSON file, database).
    *   Managing application state (`BucketMap`, `history`, `currentDay`).
*   **Frontend:**
    *   User interface for:
        *   Viewing all flashcards.
        *   Manually adding/creating new flashcards.
        *   Initiating and conducting practice sessions based on Backend schedule.
        *   Displaying card front, hint (optional), back.
        *   Receiving user input for `AnswerDifficulty` via:
            *   Mouse clicks / Keyboard shortcuts.
            *   *Input from the Hand Gesture Module*.
        *   Displaying progress statistics fetched from the Backend.
    *   Communicating with the Backend API.
    *   Integrating the Hand Gesture Module (activating webcam, processing gesture events).
*   **Browser Extension:**
    *   Providing a mechanism (e.g., context menu option) to capture selected text on a webpage.
    *   Prompting the user for the other side of the flashcard (e.g., if selected text is the front, prompt for the back).
    *   Sending the new flashcard data (front, back, potentially URL source as tag/hint) to the Backend API.
*   **Hand Gesture Input Module:**
    *   Integrating a hand pose detection library (e.g., MediaPipe).
    *   Requesting webcam access (with user permission).
    *   Processing webcam feed to detect predefined hand gestures (e.g., Thumbs Up, Thumbs Down, Flat Hand).
    *   Mapping detected gestures to `AnswerDifficulty` values (`Easy`, `Wrong`, `Hard`).
    *   Communicating the detected difficulty rating to the Frontend during a practice session.
    *   Providing visual feedback to the user about detected gestures (optional but recommended).

### Out of Scope (for initial version):

*   Advanced card editing/deletion (beyond simple creation/viewing).
*   Rich text/image support on cards (unless trivially supported by frontend).
*   User accounts / Multi-user support / Authentication.
*   Cloud synchronization / Mobile apps.
*   Complex web scraping or automated definition lookup in the browser extension.
*   Offline support for the frontend or extension (assumes connectivity to backend).
*   Customizable gestures or complex gesture sequences.
*   Support for multiple flashcard decks/sets.

## 4. Core Concepts

*   **Flashcard, Bucket, BucketMap, Modified-Leitner System, AnswerDifficulty, Practice Session, Day, PracticeRecord, ProgressStats:** As defined previously, primarily managed by the Backend based on `flashcards.ts` and `algorithms.ts`.
*   **Hand Pose Detection:** The process of using computer vision algorithms to locate key points (landmarks) of one or more hands in an image or video stream (e.g., from a webcam).
*   **Gesture Recognition:** Interpreting the detected hand pose(s) to identify specific, predefined hand shapes or movements (e.g., Thumbs Up).
*   **API (Application Programming Interface):** A defined set of rules and protocols for building and interacting with software components. Used here for communication between Frontend/Browser Extension and Backend.

## 5. System Architecture
Use code with caution.
Markdown
+---------------------+ +-----------------------+ +---------------------+
| Browser Extension |----->| Backend API |<-----| Frontend Web App |
| (Capture Text, | | (Node.js/TypeScript) | | (UI, Practice Flow) |
| Send to API) | | - Manages State | +----------+----------+
+---------------------+ | - Runs Algorithms.ts | |
| - Persistence | | Incorporates
+---------+-------------+ |
^ v
| +---------------------+
+------------------| Hand Gesture Module |
| (Webcam, Mediapipe, |
| Gesture -> Input) |
+---------------------+
*   **Backend:** A standalone service (likely Node.js) running the core logic. It listens for API requests.
*   **Frontend:** A web application (served potentially by the Backend or hosted separately) loaded in the user's browser. It fetches data from and sends updates to the Backend API. It *contains* the Hand Gesture Module.
*   **Browser Extension:** Runs within the user's browser environment, interacting with web pages. It sends data *directly* to the Backend API. Needs configuration for the Backend API endpoint.
*   **Hand Gesture Module:** A component *within* the Frontend application's code. It accesses the webcam via browser APIs and uses a library for detection. It provides input *to* the Frontend's practice session logic.

## 6. Functional Requirements

### FR-BE: Backend Service & API

*   **FR-BE.1:** MUST implement the data structures and logic from `flashcards.ts` and `algorithms.ts`.
*   **FR-BE.2:** MUST persist the application state (`BucketMap`, `history`, `currentDay`) between restarts (e.g., to a JSON file or database). MUST load state on startup.
*   **FR-BE.3:** MUST provide API endpoints (e.g., RESTful JSON API) for:
    *   `POST /api/cards`: Create a new flashcard. Expects `{ front: string, back: string, hint?: string, tags?: string[] }`. Returns the created card or its ID. Places card in Buckept 0.
    *   `GET /api/cards`: Retrieve a list of all flashcards.
    *   `GET /api/practice`: Get the set of `Flashcard` objects scheduled for practice based on the current `currentDay`. Uses `practice(toBucketSets(buckets), currentDay)`.
    *   `POST /api/practice/record`: Record the result of practicing a single card. Expects `{ cardFront: string, cardBack: string, difficulty: AnswerDifficulty }`. Updates the card's bucket using `update()` and adds a record to `history`.
    *   `GET /api/stats`: Retrieve progress statistics. Uses `computeProgress()`. Returns `ProgressStats`.
    *   `POST /api/day/advance`: Increment the `currentDay` counter.
    *   `GET /api/day`: Retrieve the current `currentDay`.
*   **FR-BE.4:** API endpoints MUST handle requests and return responses in JSON format.
*   **FR-BE.5:** MUST handle potential errors gracefully (e.g., card not found, invalid input) and return appropriate API error responses.

### FR-FE: Frontend Web Application

*   **FR-FE.1:** MUST provide a user interface to view all flashcards (fetched via `GET /api/cards`).
*   **FR-FE.2:** MUST provide a form to manually create new flashcards (sending data via `POST /api/cards`).
*   **FR-FE.3:** MUST allow the user to initiate a practice session.
    *   Fetches cards for the current day via `GET /api/practice`.
    *   If no cards, notify the user.
    *   Presents cards one by one: show front -> optional hint -> show back.
*   **FR-FE.4:** During practice, after showing the back, MUST prompt for `AnswerDifficulty`.
*   **FR-FE.5:** MUST accept difficulty input via:
    *   Clickable buttons/links (Wrong, Hard, Easy).
    *   Keyboard shortcuts (optional).
    *   *Events/callbacks from the integrated Hand Gesture Module.*
*   **FR-FE.6:** Upon receiving difficulty input, MUST send the result to the backend via `POST /api/practice/record`.
*   **FR-FE.7:** MUST display progress statistics fetched via `GET /api/stats`.
*   **FR-FE.8:** MUST provide a mechanism to activate/deactivate the Hand Gesture Module for input during practice.
*   **FR-FE.9:** MUST handle communication errors with the Backend API gracefully (e.g., show error messages).
*   **FR-FE.10:** MUST provide a way to advance the day (e.g., a button triggering `POST /api/day/advance`).

### FR-EXT: Browser Extension

*   **FR-EXT.1:** MUST add an option to the browser's context menu (e.g., "Add to Flashcards") when text is selected on a webpage.
*   **FR-EXT.2:** Clicking the context menu option MUST capture the selected text.
*   **FR-EXT.3:** MUST prompt the user (e.g., via a popup or new tab) to:
    *   Confirm the captured text as either the 'front' or 'back'.
    *   Enter the text for the *other* side of the card.
    *   Optionally add tags or a hint (e.g., source URL could be default tag/hint).
*   **FR-EXT.4:** MUST allow the user to configure the Backend API endpoint URL.
*   **FR-EXT.5:** Upon confirmation, MUST send the new card data (`front`, `back`, `hint`, `tags`) to the Backend via `POST /api/cards`.
*   **FR-EXT.6:** MUST provide feedback to the user on success or failure of adding the card.
*   **FR-EXT.7:** MUST request necessary permissions (e.g., `contextMenus`, `activeTab`, potentially storage for API URL, network access to API endpoint).

### FR-HGM: Hand Gesture Module (Integrated into Frontend)

*   **FR-HGM.1:** MUST integrate a JavaScript hand pose detection library (e.g., MediaPipe Hand Landmarker via TensorFlow.js).
*   **FR-HGM.2:** When activated by the user (within the Frontend practice UI), MUST request access to the user's webcam using browser APIs (`navigator.mediaDevices.getUserMedia`).
*   **FR-HGM.3:** MUST process the webcam video stream using the hand pose library to detect hand landmarks in real-time.
*   **FR-HGM.4:** MUST define and recognize at least three distinct, simple hand gestures corresponding to:
    *   `AnswerDifficulty.Wrong` (e.g., Thumbs Down)
    *   `AnswerDifficulty.Hard` (e.g., Flat Hand / Open Palm facing camera)
    *   `AnswerDifficulty.Easy` (e.g., Thumbs Up)
*   **FR-HGM.5:** Upon recognizing a defined gesture with sufficient confidence for a brief duration, MUST trigger an event or callback within the Frontend, passing the corresponding `AnswerDifficulty` value.
*   **FR-HGM.6:** MUST provide clear visual feedback to the user within the Frontend UI about the state:
    *   Whether the module is active.
    *   Whether a hand is detected.
    *   Which gesture (if any) is currently recognized (e.g., display an icon or text).
*   **FR-HGM.7:** MUST allow the user to deactivate the module, releasing the webcam.
*   **FR-HGM.8:** MUST handle errors gracefully (e.g., webcam access denied, library loading failure).

## 7. Non-Functional Requirements

*   **NFR1: Persistence:** Backend data MUST be saved reliably. JSON file is acceptable for simplicity; a database (like SQLite) could be considered for larger scale.
*   **NFR2: API Responsiveness:** Backend API responses should ideally complete within 500ms under moderate load.
*   **NFR3: Frontend Usability:** The Frontend UI should be intuitive and require minimal learning for core tasks (practice, adding cards).
*   **NFR4: Hand Gesture Performance:** Gesture detection should run in near real-time (< 100ms latency from gesture to detection event) without consuming excessive CPU resources or causing significant slowdowns on typical modern hardware.
*   **NFR5: Hand Gesture Accuracy:** The defined gestures should be reliably distinguishable by the detection algorithm under reasonable lighting conditions and with clear hand visibility. Minimize false positives/negatives.
*   **NFR6: Browser Extension Performance:** The extension should have minimal impact on browser performance during normal browsing. The card-adding process should be quick.
*   **NFR7: Compatibility:**
    *   Browser Extension: Specify target browsers (e.g., Chrome, Firefox, Edge).
    *   Frontend/Hand Gesture Module: Target modern evergreen browsers supporting WebRTC (`getUserMedia`) and WebGL/WASM (often required by detection libraries).
*   **NFR8: Security:**
    *   Webcam access MUST only be requested upon explicit user action within the Frontend and permission granted via the standard browser prompt.
    *   Browser Extension permissions MUST be minimized to only those necessary.
    *   Consider CORS configuration if Backend and Frontend are hosted on different origins. Basic API security (e.g., simple token) might be needed if the API is exposed publicly.
*   **NFR9: Configuration:** The Browser Extension MUST allow configuration of the Backend API URL.

## 8. Data Model

*   **Core Data (`Flashcard`, `BucketMap`, etc.):** As defined in `flashcards.ts`. Managed by Backend.
*   **API Data Format:** JSON will be used for all API request bodies and responses between Backend, Frontend, and Browser Extension.
*   **Application State (Backend):** `buckets: BucketMap`, `history: PracticeRecord[]`, `currentDay: number`.
*   **PracticeRecord (Example Structure):**
    ```typescript
    interface PracticeRecord {
      cardFront: string; // Or a unique card ID persistent across sessions
      cardBack: string;  // Or a unique card ID
      timestamp: number; // UNIX timestamp or day number
      difficulty: AnswerDifficulty;
    }
    ```
*   **ProgressStats:** As defined in `types.ts` (assumed).

## 9. Algorithm Details

*   The core learning/scheduling algorithms (`practice`, `update`, `computeProgress`, `getHint`, `toBucketSets`) are implemented in the Backend service, based on the provided `algorithms.ts`.

## 10. User Interface (High-Level)

*   **Frontend:**
    *   *Main View:* Dashboard showing stats summary, button to start practice, button to view all cards, button to add card.
    *   *Card List View:* Table or list displaying all flashcards (front/back).
    *   *Add Card View:* Form with fields for front, back, hint, tags.
    *   *Practice View:* Displays one card (front -> hint -> back). Shows buttons for Wrong/Hard/Easy. Includes a toggle to enable/disable Hand Gesture input. Provides visual feedback area for gesture detection status (inactive/active/hand detected/gesture recognized).
    *   *Stats View:* Displays detailed progress statistics from `computeProgress`.
*   **Browser Extension:**
    *   *Context Menu:* Single item "Add to Flashcards".
    *   *Popup/Tab:* Form displayed after clicking context menu. Shows selected text, input field for the other side, optional fields for hint/tags, confirm/cancel buttons. Configuration page for Backend API URL.
*   **Hand Gesture Feedback (within Frontend Practice View):**
    *   Icon indicating module status (e.g., webcam off, webcam on, searching for hand, hand detected).
    *   Temporary display of recognized gesture (e.g., show 👍 icon when Thumbs Up is detected before sending confirmation).

## 11. Technology Stack

*   **Backend:**
    *   Language: TypeScript
    *   Runtime: Node.js
    *   Framework: Express.js (recommended) or similar (Koa, Fastify)
    *   Persistence: JSON file or SQLite database
*   **Frontend:**
    *   Language: TypeScript/JavaScript
    *   Framework: React, Vue, Angular, Svelte, or Vanilla JS with HTML/CSS
    *   API Communication: `fetch` API or libraries like `axios`.
*   **Browser Extension:**
    *   Language: JavaScript (potentially TypeScript compiled to JS)
    *   APIs: WebExtension APIs (manifest v3 preferred)
    *   UI: HTML, CSS, JS for popups/options pages.
*   **Hand Gesture Module:**
    *   Language: JavaScript/TypeScript (within Frontend)
    *   Core Library: MediaPipe Hand Landmarker (via TensorFlow.js) or similar (e.g., Fingerpose library on top of MediaPipe/TFJS)
    *   Browser APIs: `navigator.mediaDevices.getUserMedia` (WebRTC)

## 12. Future Considerations

*   More sophisticated Browser Extension features (auto-detect front/back, fetch definitions).
*   Support for multiple flashcard decks/sets.
*   User accounts and synchronization.
*   More advanced gesture options or customization.
*   Improved statistics and visualizations.
*   Card editing and deletion features.
*   Accessibility improvements for all components.
*   Packaging for easier deployment (e.g., Docker for backend).