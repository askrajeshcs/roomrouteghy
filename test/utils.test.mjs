import test from "node:test";
import assert from "node:assert/strict";
import { parseRent, parsePhone, parseRoomType, parseAvailability, deduplicate } from "../scraper/utils.mjs";
test("extracts Indian rent",()=>assert.equal(parseRent("Rent: ₹ 7,500/month"),7500));
test("extracts public phone",()=>assert.deepEqual(parsePhone("Call +91 93657 87490"),["9365787490"]));
test("extracts room type",()=>assert.equal(parseRoomType("Semi furnished 2 BHK"),"2 BHK"));
test("flags unavailable",()=>assert.equal(parseAvailability("BOOKED - not available"),"unavailable"));
test("deduplicates URLs",()=>assert.equal(deduplicate([{sourceUrl:"https://a/x",phone:""},{sourceUrl:"https://a/x",phone:"9999999999"}]).length,1));
