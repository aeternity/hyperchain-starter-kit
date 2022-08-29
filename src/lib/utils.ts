import fs from "fs";
import JSONbig from "json-bigint";
import path from "path";

export function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory ${dir} does not exist. Creating it...`);
    fs.mkdirSync(dir);
  }
}

const JSONbigConfigured = JSONbig({
  useNativeBigInt: true,
  storeAsString: false,
  alwaysParseAsBig: true,
});

export const toJSON = (s: any) => {
  return JSONbigConfigured.stringify(s);
};

export const fromJSON = (s: string) => {
  return JSONbigConfigured.parse(s);
};

export const initFilePath = (dir: string) => path.join(dir, "init.yaml");
export const contractsDirPath = (dir: string) => path.join(dir, "contracts");
