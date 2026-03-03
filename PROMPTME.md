✏️ Prompt - 01

📎 Context:
I cloned my Module 7 project to start Module 8, deleted the .git folder, and created a new GitHub repository. I wasn’t sure how to properly reconnect the local project to the new remote.

Prompt:
After cloning a previous module and deleting .git, how do I properly connect the folder to a new GitHub repository and avoid conflicts with existing README files?

🤖 Response - 01

The AI explained that deleting .git removes the old repository history entirely. To connect the project to a new GitHub repo, I needed to:

Initialize Git locally with git init

Add the new remote using git remote add origin

Stage and commit the files

Push with git push -u origin main

It also clarified that if the remote was initialized with a README, I may need to pull first or use --allow-unrelated-histories depending on the state of the repos. This helped me understand how Git tracks project history and how remotes are linked.

✏️ Prompt - 02

📎 Context:
I created a new repo but forgot whether I initialized it with a README. I wanted to check before linking my local files.

Prompt:
How can I verify what exists in a GitHub repository before connecting my local project to it?

🤖 Response - 02

The AI explained that I can:

Check directly on GitHub’s web interface to see existing files

Use git ls-remote or attempt a pull to detect remote content

This reinforced how Git separates local and remote repositories and why checking remote state prevents merge headaches.

✏️ Prompt - 03

📎 Context:
After reorganizing routes and modifying my router configuration, Vite threw an import error for a component that definitely existed.

Prompt:
Why does Vite fail with “Failed to resolve import” even when the file exists?

🤖 Response - 03

The AI explained that Vite is strict about:

Exact file names

Folder names

Case sensitivity

Correct relative paths

Even small mismatches like NotificationContext vs NoticeContext can break resolution. This helped me understand how module resolution works in modern frontend tooling.

✏️ Prompt - 04

📎 Context:
I initially built notifications using local component state, but then refactored to move them into a Context so they could appear in the Navbar globally.

Prompt:
What is the correct architecture for global notifications in a React app?

🤖 Response - 04

The AI guided me to:

Create a Context provider

Store notification state in the provider

Expose a showNotice() function

Render the notification once in the Navbar

Trigger notices from any component via useNotice()

This clarified the difference between local state and global shared state, and why Context is appropriate here.

✏️ Prompt - 05

📎 Context:
After implementing the Context refactor, my screen went completely white even though the dev server was running.

Prompt:
What causes a white screen in React after a refactor?

🤖 Response - 05

The AI explained that:

White screens often mean a runtime error

Import path mismatches can silently break rendering

Duplicate context files or mismatched exports can crash the app

This reinforced careful refactoring and consistency in naming conventions.

✏️ Prompt - 06

📎 Context:
After fixing the context error, my entire app lost styling — no blue buttons, no card layout, no form styling.

Prompt:
Why would React-Bootstrap components render without styling?

🤖 Response - 06

The AI explained that React-Bootstrap does not include CSS automatically. I needed to import:

import "bootstrap/dist/css/bootstrap.min.css";

in main.jsx.

This clarified the separation between component libraries and their stylesheet dependencies.

✏️ Prompt - 07

📎 Context:
Login notifications were appearing briefly and disappearing before navigation completed.

Prompt:
How should I handle navigation timing when showing success/error notifications?

🤖 Response - 07

The AI explained that I can:

Show the notification first

Delay navigation with setTimeout

Let the Navbar render the notice globally

This helped me understand UI timing and user experience flow.

✏️ Prompt - 08

📎 Context:
I removed the Agent link from the Navbar and moved the “Create Agent” link to the Agent Management page per grading requirements.

Prompt:
Why is moving navigation links into the relevant component considered better architecture?

🤖 Response - 08

The AI explained that keeping navigation localized to the feature component:

Reduces global clutter

Improves separation of concerns

Makes routing more modular

This reinforced thinking in terms of scalable UI structure.

✏️ Prompt - 09

📎 Context:
I created a feature branch feat/notifications and merged previous work into dev.

Prompt:
What is the correct branch flow for adding a feature in a structured project?

🤖 Response - 09

The AI explained a disciplined flow:

Work in feature/...

Merge into dev

Test thoroughly

Merge into main before delivery

This helped me internalize proper Git workflow practices.

✏️ Prompt - 10

📎 Context:
While debugging, I realized I had duplicate notification logic in multiple components from my first attempt.

Prompt:
Why is duplicated state logic dangerous in React applications?

🤖 Response - 10

The AI explained that duplicating logic:

Causes inconsistent behavior

Makes debugging harder

Violates DRY principles

Increases maintenance complexity

Refactoring to a single Context-based source of truth made the app cleaner and easier to reason about.

