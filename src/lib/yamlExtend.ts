import yaml from "js-yaml";
import { readFileSync, writeFileSync } from "fs";

const options = Object.assign({}, (yaml as any).types.int.options);

options.construct = (data: any) => {
  let value = data,
    sign = 1n,
    ch;

  if (value.indexOf("_") !== -1) {
    value = value.replace(/_/g, "");
  }

  ch = value[0];

  if (ch === "-" || ch === "+") {
    if (ch === "-") sign = -1n;
    value = value.slice(1);
    ch = value[0];
  }

  return sign * BigInt(value);
};

options.predicate = (object: object) =>
  Object.prototype.toString.call(object) === "[object BigInt]" ||
  (yaml as any).types.int.options.predicate(object);

const BigIntType = new yaml.Type("tag:yaml.org,2002:int", options);

const SCHEMA_BIGINT = yaml.DEFAULT_SCHEMA.extend({
  implicit: [BigIntType],
});

export function loadYamlFile(filePath: string, bigint = true) {
  const contents = readFileSync(filePath, { encoding: "utf8", flag: "r" });
  const opts = bigint ? { schema: SCHEMA_BIGINT } : {};
  return yaml.load(contents, opts);
}
export function writeYamlFile(filePath: string, obj: object) {
  const encoded = yaml.dump(obj, {
    schema: SCHEMA_BIGINT,
    sortKeys: true,
    condenseFlow: true,
    forceQuotes: true,
  });
  console.log(`Writing yaml file ${filePath}`);
  writeFileSync(filePath, encoded);
}
