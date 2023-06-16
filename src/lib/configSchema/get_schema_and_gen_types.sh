#!/bin/bash

# Parsing CLI arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
#        -p|--path) path="$2"; shift ;;
        -u|--url) url="$2"; shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

# Checking for required arguments
if [[ -z "$url" ]]; then
    echo "Usage: $0 --url <schema_url>"
    exit 1
fi

# Download the json schema
filename=$(basename "$url")
wget -O "$filename" "$url"

# Generate Typescript types from json schema
path="src/lib/configSchema/"
output_ts="${filename%.*}-gen.d.ts"
pnpm json2ts "$path$filename" > "$output_ts"

# Generate Zod definitions from Typescript types
output_zod="${filename%.*}.ts"
pnpm ts-to-zod "$path$output_ts" "$path$output_zod" --skipValidation --keepComments

# Prepend some info.
string_to_prepend="// Json schema downloaded from $url
"
# Read the existing contents of the file
file_contents=$(cat "$output_zod")
# Concatenate the string to prepend with the existing file contents
new_contents="$string_to_prepend"$'\n'"$file_contents"
# Overwrite the file with the new contents
echo "$new_contents" > "$output_zod"

echo "Script completed successfully."
