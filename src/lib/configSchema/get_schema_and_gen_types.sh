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

# Downloading the smart contract
filename=$(basename "$url")
wget -O "$filename" "$url"

# Generate types
path="src/lib/configSchema/"
output="${filename%.*}.ts"
pnpm json-schema-to-zod -s "$path$filename" -t "$path$output"

# Prepend some info.
string_to_prepend="// This file was generated. Do not edit it manually.
// Schema copied from $url
"
# Read the existing contents of the file
file_contents=$(cat "$output")
# Concatenate the string to prepend with the existing file contents
new_contents="$string_to_prepend"$'\n'"$file_contents"
# Overwrite the file with the new contents
echo "$new_contents" > "$output"

echo "Script completed successfully."
