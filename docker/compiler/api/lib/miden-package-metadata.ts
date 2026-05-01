import { execFile } from "@/lib/utils.js";

export const midenPackageMetadata = async (maspPath: string) => {
  try {
    const { stdout, stderr } = await execFile("miden-package-metadata", [
      maspPath,
    ]);
    return { stdout, stderr };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "cargo-miden failed";
    return { error: message };
  }
};
