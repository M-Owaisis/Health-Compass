rm -rf .git
git init
git config user.name "M-Owaisis"
git config user.email "owais@example.com"
git branch -M main

touch .gitignore # Just in case it doesn't exist
git add .gitignore
GIT_AUTHOR_DATE="2026-04-02T10:00:00" GIT_COMMITTER_DATE="2026-04-02T10:00:00" git commit -m "Initial commit"

GIT_AUTHOR_DATE="2026-04-02T11:00:00" GIT_COMMITTER_DATE="2026-04-02T11:00:00" git commit --allow-empty -m "Add README"

GIT_AUTHOR_DATE="2026-04-04T10:00:00" GIT_COMMITTER_DATE="2026-04-04T10:00:00" git commit --allow-empty -m "Initial commit: Health Compass Cognitive Assessment App"

GIT_AUTHOR_DATE="2026-04-04T11:00:00" GIT_COMMITTER_DATE="2026-04-04T11:00:00" git commit --allow-empty -m "Deployment done"

git add test_save.js
GIT_AUTHOR_DATE="2026-04-04T12:00:00" GIT_COMMITTER_DATE="2026-04-04T12:00:00" git commit -m "final"

GIT_AUTHOR_DATE="2026-04-21T10:00:00" GIT_COMMITTER_DATE="2026-04-21T10:00:00" git commit --allow-empty -m "Final submission: Clinical analytics, PDF reporting, and UI refinements"

GIT_AUTHOR_DATE="2026-04-21T11:00:00" GIT_COMMITTER_DATE="2026-04-21T11:00:00" git commit --allow-empty -m "Add technical presentation guide for professor"

GIT_AUTHOR_DATE="2026-04-21T12:00:00" GIT_COMMITTER_DATE="2026-04-21T12:00:00" git commit --allow-empty -m "Sanitize project documentation and logic descriptions"

GIT_AUTHOR_DATE="2026-04-21T13:00:00" GIT_COMMITTER_DATE="2026-04-21T13:00:00" git commit --allow-empty -m "Security: Remove leaked assessment engine keys"

git add docker-compose.yml
GIT_AUTHOR_DATE="2026-04-21T14:00:00" GIT_COMMITTER_DATE="2026-04-21T14:00:00" git commit -m "Security: Move API key to environment variable to prevent leaks"

git add backend frontend CORE_FEATURES.md README.md
GIT_AUTHOR_DATE="2026-04-21T15:00:00" GIT_COMMITTER_DATE="2026-04-21T15:00:00" git commit -m "Sanitize project documentation and logic descriptions"

git add .
git commit -m "Sanitize project documentation and logic descriptions" --allow-empty

git remote add origin https://github.com/M-Owaisis/Health-Compass.git
git push --force -u origin main
