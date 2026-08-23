import { createHash } from "node:crypto";
import { LOCALITIES } from "./config.mjs";

export const clean = value => String(value || "").replace(/\s+/g, " ").trim();

export function stableId(url, title, area, rent) {
  return createHash("sha1").update(`${url}|${title}|${area}|${rent}`).digest("hex").slice(0, 14);
}

export function findLocality(text) {
  const lower = text.toLowerCase();
  return Object.keys(LOCALITIES).sort((a,b)=>b.length-a.length).find(name => lower.includes(name.toLowerCase())) || "Guwahati";
}

export function coordinates(area, seed="") {
  if (LOCALITIES[area]) return { lat: LOCALITIES[area][0], lng: LOCALITIES[area][1] };
  const hash = [...seed].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0, 7);
  return { lat: 26.144 + (hash % 350) / 10000, lng: 91.746 + ((hash >> 8) % 500) / 10000 };
}

export function parseRent(text) {
  const patterns = [/₹\s*([\d,]{3,8})/i, /(?:rent|price)\s*[:\-]?\s*(?:rs\.?|₹)?\s*([\d,]{3,8})/i, /\b([2-9]\d{3}|[1-9]\d{4})\s*\/?\s*(?:month|monthly|pm)\b/i];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = Number(match[1].replaceAll(",", ""));
      if (value >= 1500 && value <= 150000) return value;
    }
  }
  return 0;
}

export function parsePhone(text) {
  const matches = text.match(/(?:\+?91[\s-]?)?[6-9](?:[\s-]?\d){9}\b/g) || [];
  return [...new Set(matches.map(v => v.replace(/\D/g, "").slice(-10)))].slice(0, 2);
}

export function parseRoomType(text) {
  const bhk = text.match(/\b([1-9])\s*(BHK|RK)\b/i);
  if (bhk) return `${bhk[1]} ${bhk[2].toUpperCase()}`;
  if (/single\s+room/i.test(text)) return "Single room";
  if (/double\s+room/i.test(text)) return "Double room";
  if (/roommate|flatmate|sharing/i.test(text)) return "Shared room";
  if (/\bPG\b|paying guest/i.test(text)) return "PG";
  return "Room";
}

export function parseBathrooms(text) {
  const match = text.match(/\b([1-9])\s*(?:bathrooms?|bath)\b/i);
  if (match) return `${match[1]} bath${match[1] === "1" ? "" : "s"}`;
  return /attached\s+(?:bath|washroom)/i.test(text) ? "Attached" : "Ask owner";
}

export function parseSize(text) {
  const match = text.match(/([\d,]{2,5})\s*(?:sq\.?\s*ft|sqft|square\s*feet)/i);
  return match ? `${match[1].replaceAll(",", "")} sq ft` : "";
}

export function parsePosted(text) {
  const match = text.match(/\b(today|yesterday|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*(?:\s+20\d{2})?|\d+\s+(?:hours?|days?|weeks?|months?)\s+ago)\b/i);
  return match ? match[1] : "Recently listed";
}

export function parseAvailability(text) {
  if (/\b(booked|not\s+available|unavailable|already\s+rented|sold\s+out)\b/i.test(text)) return "unavailable";
  return "available";
}

export function normalizeUrl(raw, base) {
  try {
    const url = new URL(raw, base);
    ["utm_source","utm_medium","utm_campaign","fbclid","gclid"].forEach(k=>url.searchParams.delete(k));
    url.hash = "";
    return url.toString();
  } catch { return ""; }
}

export function listingFromText({ source, url, title, text }) {
  const body = clean(`${title} ${text}`).slice(0, 12000);
  const rent = parseRent(body);
  const area = findLocality(body);
  if (!rent || area === "Guwahati") return null;
  const roomType = parseRoomType(body);
  const position = coordinates(area, url);
  const resolvedTitle = clean(title || body.slice(0, 90)) || `${roomType} for rent`;
  return {
    id: stableId(url, resolvedTitle, area, rent), title: resolvedTitle.slice(0, 140), area, rent,
    rooms: roomType, bath: parseBathrooms(body), size: parseSize(body), source, sourceUrl: url,
    phone: parsePhone(body)[0] || "", lat: position.lat, lng: position.lng,
    note: clean(body).slice(0, 260), posted: parsePosted(body), status: parseAvailability(body),
    firstSeen: new Date().toISOString(), lastSeen: new Date().toISOString()
  };
}

export function deduplicate(listings) {
  const output = [];
  const positions = new Map();
  for (const item of listings) {
    const urlKey = `url:${String(item.sourceUrl || "").replace(/\?.*$/, "").replace(/\/$/, "")}`;
    const detailKey = `property:${String(item.area || "").toLowerCase()}|${item.rent || 0}|${String(item.rooms || "").toLowerCase()}|${item.phone || ""}`;
    const found = positions.get(urlKey) ?? positions.get(detailKey);
    if (found === undefined) {
      positions.set(urlKey, output.length);
      positions.set(detailKey, output.length);
      output.push(item);
    } else if (item.phone && !output[found].phone) {
      output[found] = item;
      positions.set(urlKey, found);
      positions.set(detailKey, found);
    }
  }
  return output;
}
