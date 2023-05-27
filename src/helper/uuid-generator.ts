import { customAlphabet } from "nanoid";
import uuid4 from "uuid4";

export async function generateUserUUID() {
  let genUUID = uuid4();
  return genUUID;
}

export async function generateSeatUUID() {
  let genUUID = customAlphabet("1234abcd", 4)();
  return genUUID;
}

export async function generateScheduleUUID() {
  let genUUID = customAlphabet("5678efgh", 4)();
  return genUUID;
}
