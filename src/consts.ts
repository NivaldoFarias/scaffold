import path from "node:path";
import { fileURLToPath } from "node:url";

// With the move to TSUP as a build tool, this keeps path routes
// in other files (installers, loaders, etc) in check more easily.
const __filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(__filename);

export const PKG_ROOT = path.join(distPath, "../");
