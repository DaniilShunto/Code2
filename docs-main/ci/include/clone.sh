DEFAULT_REPO_BASE=ssh://git@git.opentalk.dev:222
REPO_BASE="${REPO_BASE:-$DEFAULT_REPO_BASE}"

clone_repo() {
  REPO_NAME="$1"
  GIT_REF_EXT="$2"

  TMPDIR=".tmp/$REPO_NAME"
  REPO_SOURCE="${REPO_BASE}/${REPO_NAME}.git"

  rm -rf "$TMPDIR"
  mkdir -p "$TMPDIR"
  git clone \
    --recurse-submodules \
    --depth=1 \
    --shallow-submodules \
    --no-single-branch \
    --branch "$GIT_REF_EXT" \
    "$REPO_SOURCE" \
    "$TMPDIR"
}

# This takes the destination parameter before the source parameters, because
# there might be multiple source parameters while there is only a single destination.
# This facilitates implementation of that function significantly.
deploy_to() {
  DESTINATION="$1"; shift
  SOURCE="$*"

  cp -rv $SOURCE $DESTINATION
}

