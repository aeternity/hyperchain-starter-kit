# Info
The [Aeternity Config Schema](https://github.com/aeternity/aeternity/blob/master/apps/aeutils/priv/aeternity_config_schema.json) is used to validate the generated configuration file `aeternity.yaml` in `genAeternityConf()` 

### Script
The script downloads the Json schema and generates TS and Zod files.

Usage:

``` 
./get_schema_and_gen_types --url <schema_url> 
```

**Note:** We do not use `json-schema-to-zod` directly because it does not support all the types in the schema. See issue: 
https://github.com/StefanTerdell/json-schema-to-zod/issues/51

Passing the schema through `json-schema-to-typescript` loses the default values and changes .describe() to comments.

### Generated files
The script produces the following files:
1. Downloaded `aeternity_config_schema.json` from the given URL.
2. Generated TypeScript definitions `aeternity_config_schema-gen.d.ts` from the schema.
3. Generated Zod definitions `aeternity_config_schema.ts` from the TS types.
