#!/bin/bash

# Usage: ./scripts/auto-commit.sh "commit message"

if [ -z "$1" ]; then
    echo "Error: Commit message required"
    echo "Usage: ./scripts/auto-commit.sh \"your commit message\""
    exit 1
fi

COMMIT_MSG="$1"

# Check for forbidden words
FORBIDDEN_WORDS=("AI" "Claude" "Agent" "GPT" "Bot" "Assistant" "Artificial Intelligence")
for word in "${FORBIDDEN_WORDS[@]}"; do
    if echo "$COMMIT_MSG" | grep -qi "$word"; then
        echo "❌ Error: Commit message contains forbidden word: $word"
        echo "Forbidden words: AI, Claude, Agent, GPT, Bot, Assistant, Artificial Intelligence"
        echo "Focus on WHAT was done, not WHO/WHAT created it."
        exit 1
    fi
done

echo "🔍 Running quality checks..."
./scripts/quality-check.sh

if [ $? -ne 0 ]; then
    echo "❌ Quality checks failed. Fix issues before committing."
    exit 1
fi

echo ""
echo "📝 Committing changes..."
git add .
git commit -m "$COMMIT_MSG"

if [ $? -ne 0 ]; then
    echo "❌ Git commit failed"
    exit 1
fi

echo "✅ Commit successful"
echo ""
echo "🚀 Pushing to remote..."
git push

if [ $? -ne 0 ]; then
    echo "⚠️  Push failed. You may need to pull first or set upstream branch."
    exit 1
fi

echo "✅ Push successful"
echo "🎉 Done!"
