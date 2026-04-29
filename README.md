# Miden Sourcify

Miden Sourcify is a set of self-hostable services for verifying that on-chain Miden accounts and notes correspond to specific Rust source packages.

## Architecture overview

4 services, deployable independently or together:

1. **Compilation & Verification API** — stateless, compute-heavy, Rust-in-container.
2. **Verified Accounts & Notes Registry API** — stateful, Node.js + Postgres, delegates compute to (1).
3. **Verify frontend** — static webapp talking to (2).
4. **Contract viewer frontend** _(optional)_ — static webapp talking to (2).

The registry never compiles or verifies on its own; it always delegates to the Compilation API and persists the result. This keeps the heavy Rust toolchain isolated from the database tier.

## License

MIT
