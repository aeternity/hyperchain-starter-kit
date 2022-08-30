import { AccountWithSecrets, genAccount } from "./basicTypes.js";
import z from "zod";
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

export const Validator = z.object({
  name: z.string(),
  description: z.union([z.string(), z.null()]),
  image_url: z.union([z.string(), z.null()]),
  account: AccountWithSecrets,
  initialBalance: z.bigint(),
});
export type Validator = z.infer<typeof Validator>;

function genValidator({
  nameSeed,
  initialBalance,
}: {
  nameSeed?: number | string;
  initialBalance: bigint;
}): Validator {
  return {
    name: genValidatorName({ seed: nameSeed }),
    description: null,
    image_url: null,
    account: genAccount(),
    initialBalance,
  };
}

export const genValidators = (count: bigint, initialBalance: bigint) =>
  Array.from({ length: Number(count) }).map((x, n) =>
    genValidator({ nameSeed: n + 1 + 123456, initialBalance })
  );
