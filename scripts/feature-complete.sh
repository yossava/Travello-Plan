#!/bin/bash

# Usage: ./scripts/feature-complete.sh "commit message"

if [ -z "$1" ]; then
    echo "Error: Commit message required"
    echo "Usage: ./scripts/feature-complete.sh \"your commit message\""
    exit 1
fi

COMMIT_MSG="$1"

echo "🎯 Completing feature..."
echo ""

./scripts/auto-commit.sh "$COMMIT_MSG"

if [ $? -ne 0 ]; then
    echo "❌ Auto-commit failed"
    exit 1
fi

echo ""
echo "🎉 Feature complete and pushed!"
echo ""
echo "📋 Next steps:"
echo "  1. Create a pull request if working on a feature branch"
echo "  2. Request code review"
echo "  3. Merge to main after approval"
