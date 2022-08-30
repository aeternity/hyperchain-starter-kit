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
  return JSONbigConfigured.stringify(s);
};

export const fromJSON = (s: string) => {
  return JSONbigConfigured.parse(s);
};
