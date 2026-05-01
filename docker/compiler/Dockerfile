FROM node:24-slim

RUN apt update && apt install -y --no-install-recommends curl ca-certificates build-essential

ENV RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    PATH=/usr/local/cargo/bin:$PATH

# RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \
#     | sh -s -- -y --no-modify-path --profile minimal --default-toolchain nightly-2025-12-10 \
#     && rustup default nightly-2025-12-10
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \
     | sh -s -- -y --no-modify-path --profile minimal --default-toolchain nightly-2025-12-10

# Install cargo-miden
RUN cargo install cargo-miden

# Copy project template
WORKDIR /cache/project-template
COPY project-template .

# Warm cargo-miden
RUN mkdir target
WORKDIR /cache/project-template/counter-account
RUN CARGO_TARGET_DIR=/cache/target cargo miden build --release

WORKDIR /home/node/crates
COPY crates .

WORKDIR /home/node/crates/miden-package-metadata
RUN cargo install --path . --locked

WORKDIR /home/node/api

COPY api/package.json api/package-lock.json ./

RUN npm ci

COPY api .
RUN npm run build

CMD ["npm", "start"]
