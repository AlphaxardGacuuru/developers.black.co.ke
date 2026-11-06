#!/usr/bin/env bash
#
# Run by the Forge deploy script from inside the new release directory,
# between $CREATE_RELEASE() and $ACTIVATE_RELEASE().
#
# The server does not build the app: `next build` and even a full `npm ci` run
# it out of memory. GitHub Actions (.github/workflows/build.yml) builds every
# push to main and uploads it to the `builds` release; this script installs the
# runtime dependencies and unpacks that build.

set -euo pipefail

REPO="AlphaxardGacuuru/developers.black.co.ke"
COMMIT="$(git rev-parse HEAD)"
# Releases live in <site>/releases/<id>, next to the <site>/current symlink
CURRENT="$(cd ../../current 2>/dev/null && pwd -P || true)"
BUILD_URL="https://github.com/$REPO/releases/download/builds/$COMMIT.tar.gz"
ATTEMPTS=60
BUILD_ARCHIVE="$(mktemp)"
trap 'rm -f "$BUILD_ARCHIVE"' EXIT

# Runtime dependencies. When the lockfile hasn't changed, hard-link the live
# release's node_modules (no install, no extra disk). Otherwise install only
# production dependencies; the build tooling is not needed here.
if [ -n "$CURRENT" ] && [ -d "$CURRENT/node_modules" ] && cmp -s package-lock.json "$CURRENT/package-lock.json"; then
	echo "Lockfile unchanged: reusing node_modules from $CURRENT"
	cp -al "$CURRENT/node_modules" node_modules
else
	echo "Lockfile changed: installing production dependencies"
	npm ci --omit=dev --no-audit --no-fund
fi

# The build for this commit. Push-to-deploy starts this deploy at the same time
# as the GitHub Actions build, so wait for it to be uploaded.
for attempt in $(seq 1 "$ATTEMPTS"); do
	if curl -fsSL -o "$BUILD_ARCHIVE" "$BUILD_URL"; then
		break
	fi

	if [ "$attempt" -eq "$ATTEMPTS" ]; then
		echo "No build for $COMMIT after $((ATTEMPTS * 10)) seconds."
		echo "Check the Build workflow: https://github.com/$REPO/actions/workflows/build.yml"
		exit 1
	fi

	echo "Waiting for the GitHub Actions build of $COMMIT ($attempt/$ATTEMPTS)"
	sleep 10
done

tar -xzf "$BUILD_ARCHIVE"
test -f .next/BUILD_ID
echo "Unpacked build $(cat .next/BUILD_ID) for $COMMIT"
