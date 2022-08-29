import yaml from "js-yaml";

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

export const SCHEMA_BIGINT = yaml.DEFAULT_SCHEMA.extend({
  implicit: [BigIntType],
});
