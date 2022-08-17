import axios from "axios";
import yaml from "js-yaml";
import openapiTS from "openapi-typescript";
import * as fs from "fs";

const COMPILER_SCHEMA =
  "https://raw.githubusercontent.com/aeternity/aesophia_http/master/config/swagger.yaml";

const fetchedSource = await (await axios.get(COMPILER_SCHEMA)).data.trim();

const jsonSpec = yaml.load(fetchedSource, { json: true });

const output = await openapiTS(jsonSpec);

fs.writeFile("src/lib/compilerApi.ts", output, (err) => {
  if (err) {
    console.log("ERROR:", err);
  }
});

// console.log(output);
