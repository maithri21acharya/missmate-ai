# MissMate AI — What Did I Miss?

**Catch up. Focus on what matters.**

MissMate AI helps people catch up on long or unread group chats quickly. Paste a conversation, and the app turns it into a useful catch-up report with:

- A short, readable summary of the conversation
- Urgent or high-priority messages
- Action items and tasks (with checkboxes)
- Decisions and changes
- Dates, deadlines, meetings, and events
- Other unclassified messages for context
- Statistics and a copy-to-clipboard report

## Features

- **Privacy-first:** All analysis happens locally in your browser. No data is uploaded, stored, or transmitted.
- **No API keys required:** Uses keyword and rule-based heuristic analysis — no paid AI model or external service.
- **No login required:** The core demo works without any account.
- **Works offline:** Once the page is loaded, analysis runs entirely client-side.
- **Accessible:** Semantic HTML, keyboard-accessible controls, visible focus states, and labeled form elements.
- **Responsive:** Adapts to mobile, tablet, and desktop screens.
- **Action item checklist:** Mark tasks as complete — checkboxes update visually in real time.
- **Copy report:** Export the full report as readable plain text with a clipboard fallback.

## Screenshots

<!-- Add screenshots of the app here once deployed -->

![MissMate AI Screenshot](placeholder.png)

## Technology Stack

- **React 18** with TypeScript
- **Vite** for build tooling and dev server
- **Tailwind CSS** for styling
- **Lucide React** for icons

## How It Works

MissMate AI uses a transparent, keyword and rule-based scoring system to classify messages:

1. **Split** the input into individual message lines.
2. **Parse** sender names (if a line starts with "Name:").
3. **Classify** each message into categories using keyword lists:
   - **Priority:** "urgent", "ASAP", "deadline", "important", etc.
   - **Action items:** "please", "finish", "send", "upload", "prepare", etc.
   - **Decisions:** "decided", "confirmed", "agreed", "cancelled", etc.
   - **Dates & events:** Date/time patterns, day names, "meeting", "deadline", etc.
4. **Score** messages by urgency to rank priority messages.
5. **Summarize** with a stats-based overview.

> **Note:** This is a **prototype** that uses heuristic keyword analysis, not a true AI language model. It can miss sarcasm, context, implied tasks, or exact deadlines. Always verify important details against the original messages.

## Local Setup

### Prerequisites

- [Node.js](https://nodejs.org/) version 18 or higher

### Steps

1. **Download or clone the repository:**

   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
   cd YOUR-REPOSITORY
   ```

   Or download the ZIP from GitHub and extract it.

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

   The site will be available at `http://localhost:5173`.

4. **Build for production (optional):**

   ```bash
   npm run build
   ```

   This creates a `dist/` folder with optimized static files.

5. **Preview the production build (optional):**

   ```bash
   npm run preview
   ```

## GitHub Setup

1. **Create a new repository on GitHub:**
   - Go to [github.com/new](https://github.com/new)
   - Name it (e.g., `missmate-ai`)
   - Leave it public or private
   - Do NOT initialize with a README (we already have one)

2. **Push your code to GitHub:**

   ```bash
   git init
   git add .
   git commit -m "Build MissMate AI hackathon MVP"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
   git push -u origin main
   ```

   > **Important:** Replace `YOUR-USERNAME/YOUR-REPOSITORY` with your actual GitHub username and repository name.

## Deploy with GitHub Pages

1. **Add the deployment dependency:**

   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy scripts to `package.json`:**

   Add these to the `"scripts"` section:
   ```json
   "deploy": "gh-pages -d dist"
   ```

3. **Set the base path in `vite.config.ts`:**

   Add `base: '/YOUR-REPOSITORY/'` before `plugins`.

4. **Build and deploy:**

   ```bash
   npm run build
   npm run deploy
   ```

5. **Enable GitHub Pages:**
   - Go to your repository settings on GitHub
   - Scroll to "Pages"
   - Set the source to the `gh-pages` branch
   - Your site will be live at `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`

## Manual Test Checklist

- [ ] Click "Load sample chat" — the text area populates with a sample conversation
- [ ] Message count updates as you type or paste
- [ ] Click "Analyze conversation" with empty input — a helpful error message appears
- [ ] Click "Analyze conversation" with messages — a loading spinner appears, then the report
- [ ] The quick summary describes the conversation
- [ ] Statistics bar shows correct counts
- [ ] Priority messages section shows urgent messages
- [ ] Action items show checkboxes — clicking one marks it complete (strikethrough)
- [ ] Decisions & changes section shows decision-related messages
- [ ] Dates & events section shows date/time references
- [ ] Other messages section shows unclassified messages
- [ ] Click "Copy report" — report text is copied to clipboard
- [ ] Click "Clear" — input, report, counters, and status all reset
- [ ] Test on a mobile-width screen — layout remains usable
- [ ] No API keys or secrets are present in the code

## Limitations

- Uses heuristic keyword matching, not a true AI model — context and nuance may be missed.
- Cannot detect sarcasm, implied tasks, or indirect requests.
- Date and deadline detection may miss informal references (e.g., "end of next week").
- Messages are classified by keywords, so a single message may appear in multiple sections only if it genuinely matches multiple categories.
- Does not connect to WhatsApp, Instagram, Telegram, email, or any private account — users manually paste text.

## Future Improvements

- Integrate a real LLM API (e.g., OpenAI) for more accurate summarization (optional, with user consent)
- Support for multiple chat formats (WhatsApp export, Telegram export)
- Dark mode toggle
- Save reports locally for later reference
- User accounts and saved history (with Supabase)
- Multi-language support
- Thread/reply detection for more accurate context

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
