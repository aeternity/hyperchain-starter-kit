import { definitions, paths } from "./compilerApi";
import axios, { AxiosResponse } from "axios";

export const COMPILER_URL = "https://v8.compiler.aepps.com";

export async function getACI(source: string): Promise<definitions["ACI"]> {
  const resp = await axios
    .post<paths["/aci"], AxiosResponse<definitions["ACI"]>>(
      `${COMPILER_URL}aci`,
      {
        code: source,
        options: {},
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .catch((e) => {
      console.log("error message", e.message);
      console.log("error data", e.response.data);
    });
  if (!resp) {
    throw new Error("Could not fetch ACI");
  }
  return resp.data;
}
