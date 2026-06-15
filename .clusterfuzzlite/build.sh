#!/bin/bash -eu
# SPDX-License-Identifier: Apache-2.0
# Build script for the ouroboros Jazzer.js fuzzers.
#
# Primary PR fuzzing runs via .github/workflows/fuzz.yml (raw Jazzer.js).
# This script keeps the .clusterfuzzlite/ layout buildable in any
# OSS-Fuzz / ClusterFuzzLite-style environment and backs the OpenSSF
# Scorecard "Fuzzing" signal. The ClusterFuzzLite GitHub Action itself is
# not used because its JavaScript sanitizer policy is broken upstream
# (see issue #47).

cd "$SRC/ouroboros"

corepack enable || true
corepack prepare pnpm@10.26.1 --activate || true
pnpm install --frozen-lockfile

# Compile the fuzz target to CommonJS so the harness can require() it.
pnpm exec tsc -p tsconfig.fuzz.json
printf '{"type":"commonjs"}\n' > dist-fuzz/package.json

# Stage the compiled target and each harness into $OUT.
cp -r dist-fuzz "$OUT/dist-fuzz"
for fuzzer in "$SRC/ouroboros/.clusterfuzzlite/fuzzers"/*.cjs; do
  name=$(basename "$fuzzer" .cjs)
  cp "$fuzzer" "$OUT/${name}.cjs"
  cat > "$OUT/${name}" <<EOF
#!/bin/bash
this_dir=\$(dirname "\$0")
node "\$this_dir/${name}.cjs" "\$@"
EOF
  chmod +x "$OUT/${name}"
done
