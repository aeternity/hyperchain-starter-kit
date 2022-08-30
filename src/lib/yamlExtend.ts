import yaml from "js-yaml";
import { readFileSync, writeFileSync } from "fs";

let options = Object.assign({}, (yaml as any).types.int.options);

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

options.predicate = (object: object) => {
  return (
    Object.prototype.toString.call(object) === "[object BigInt]" ||
    (yaml as any).types.int.options.predicate(object)
  );
};

let BigIntType = new yaml.Type("tag:yaml.org,2002:int", options);

const SCHEMA_BIGINT = yaml.DEFAULT_SCHEMA.extend({
  implicit: [BigIntType],
});

export function loadYamlFile(filePath: string) {
  const contents = readFileSync(filePath, { encoding: "utf8", flag: "r" });
  return yaml.load(contents, { schema: SCHEMA_BIGINT });
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
