import { AccountWithSecrets, genAccount } from "./basicTypes.js";
import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from "unique-names-generator";

const genValidatorName = ({ seed }: { seed?: number | string }) =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    length: 2,
    separator: " ",
    style: "capital",
    seed,
  });

interface Validator {
  name: string;
  account: AccountWithSecrets;
}

function genValidator({ nameSeed }: { nameSeed?: number | string }): Validator {
  return {
    name: genValidatorName({ seed: nameSeed }),
    account: genAccount(),
  };
}

export const genValidators = (count: number) =>
  Array.from({ length: count }).map((x, n) =>
    genValidator({ nameSeed: n + 1 + 123456 })
  );
