import fs from "fs";
import JSONbig from "json-bigint";

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
  return JSONbigConfigured.stringify(s, null, 2);
};

export const fromJSON = (s: string) => {
  return JSONbigConfigured.parse(s);
};

export const readFile = (path: string) =>
  fs.readFileSync(path, { encoding: "utf8", flag: "r" });

export const loadJsonFile = (path: string) => fromJSON(readFile(path));
