"use strict";
"use server";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils/crypto.ts
var crypto_exports = {};
__export(crypto_exports, {
  generateToken: () => generateToken,
  verifyToken: () => verifyToken
});
function generateToken(clientId) {
  return import_crypto.default.createHmac("sha256", SECRET_KEY).update(clientId).digest("hex").slice(0, 16);
}
function verifyToken(clientId, token) {
  if (!clientId || !token) return false;
  const expectedToken = generateToken(clientId);
  return token === expectedToken;
}
var import_crypto, SECRET_KEY;
var init_crypto = __esm({
  "src/utils/crypto.ts"() {
    "use strict";
    import_crypto = __toESM(require("crypto"));
    SECRET_KEY = process.env.QR_SECRET_KEY || "health-metro-default-secret-2026";
  }
});

// src/app/actions/customer.ts
var customer_exports = {};
__export(customer_exports, {
  getBlockedSlots: () => getBlockedSlots,
  submitCustomerRegistration: () => submitCustomerRegistration,
  verifyRegistrationToken: () => verifyRegistrationToken
});
module.exports = __toCommonJS(customer_exports);

// src/utils/supabase/admin.ts
var import_supabase_js = require("@supabase/supabase-js");
function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
  }
  return (0, import_supabase_js.createClient)(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// src/app/actions/customer.ts
async function submitCustomerRegistration(formData) {
  let supabase;
  try {
    supabase = createAdminClient();
  } catch (configErr) {
    console.error("Supabase admin client config error:", configErr.message);
    return { success: false, error: `Server configuration error: ${configErr.message}.` };
  }
  const dataString = formData.get("data");
  if (!dataString) throw new Error("Form data missing");
  const data = JSON.parse(dataString);
  console.log("--- CUSTOMER FORM SUBMIT ---");
  console.log("Payload data:", data);
  const clientId = formData.get("clientId");
  const referralSource = formData.get("referralSource");
  console.log("clientId:", clientId, "referralSource:", referralSource);
  const gpsString = formData.get("gpsCoords");
  const gpsCoords = gpsString ? JSON.parse(gpsString) : null;
  try {
    console.log("Searching for provider with client_id:", `"${clientId}"`);
    const { data: providerData, error: pErr } = await supabase.from("providers").select("id, type_code, sequence, status").eq("client_id", clientId).eq("status", "approved").single();
    if (pErr || !providerData) {
      console.error("Provider Lookup Failed:", pErr?.message || "No provider found");
      if (pErr) console.error("Full Error:", JSON.stringify(pErr));
      throw new Error(`Invalid Provider Client ID: ${pErr?.message || "No approved provider found for " + clientId}`);
    }
    console.log("Provider verified:", providerData.id);
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    const clientShort = `${providerData.type_code}${providerData.sequence}`;
    const { data: stateData } = await supabase.from("states").select("id").eq("state_code", data.state_code).single();
    const { data: customerId, error: rpcError } = await supabase.rpc("generate_customer_id", {
      p_client_short: clientShort,
      p_service_type: "BLD",
      p_year: year
    });
    if (rpcError) {
      console.error("RPC generate_customer_id error:", rpcError);
    }
    const finalCustomerId = customerId || `CUST-${clientShort}-${year}-BLD-${String(Math.floor(Math.random() * 99999)).padStart(6, "0")}`;
    const customerParts = finalCustomerId.split("-");
    const sequence = parseInt(customerParts[customerParts.length - 1], 10);
    const { data: customerData, error: customerError } = await supabase.from("customers").insert({
      customer_id: finalCustomerId,
      client_id: clientId,
      provider_id: providerData.id,
      client_short: clientShort,
      full_name: data.full_name,
      gender: data.gender,
      age: parseInt(data.age, 10),
      mobile: data.mobile,
      email: data.email || null,
      address: data.address,
      state_id: stateData?.id || null,
      city_id: null,
      pin_code: data.pin_code,
      collection_type: data.collection_type,
      home_address: data.home_address || null,
      latitude: gpsCoords?.lat || null,
      longitude: gpsCoords?.lng || null,
      maps_link: data.maps_link || null,
      service_type: "BLD",
      year,
      sequence,
      referral_source: null,
      // bypassing constraint until db is updated
      declaration_agreed: data.consent_accurate && data.consent_collection
    }).select().single();
    if (customerError) {
      throw new Error(`Customer Insert Failed: ${customerError.message}`);
    }
    const { data: bookingData, error: bookingError } = await supabase.from("bookings").insert({
      customer_id: customerData.id,
      provider_id: providerData.id,
      slot_date: data.appointment_date,
      slot_time: data.time_slot,
      status: "booked",
      payment_status: "PENDING",
      activation_status: "PENDING_PAYMENT"
    }).select().single();
    if (bookingError) {
      if (bookingError.code === "23505") {
        throw new Error("SLOT_CONFLICT: This time slot is already booked for this provider. Please select another slot.");
      }
      throw new Error(`Booking Insert Failed: ${bookingError.message}`);
    }
    return { success: true, customer_id: finalCustomerId, booking: bookingData };
  } catch (error) {
    console.error("Customer Registration failed:", error);
    return { success: false, error: error.message || "Registration failed" };
  }
}
async function getBlockedSlots(dayOfWeek) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("slot_configuration").select("slot_time").eq("day_of_week", dayOfWeek).eq("is_blocked", true);
  if (error) {
    console.error("Error fetching blocked slots:", error);
    return [];
  }
  return data.map((s) => s.slot_time);
}
async function verifyRegistrationToken(clientId, token) {
  const { verifyToken: verifyToken2 } = await Promise.resolve().then(() => (init_crypto(), crypto_exports));
  return verifyToken2(clientId, token);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getBlockedSlots,
  submitCustomerRegistration,
  verifyRegistrationToken
});
