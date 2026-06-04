"use strict";
"use server";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/app/actions/provider.ts
var provider_exports = {};
__export(provider_exports, {
  submitProviderRegistration: () => submitProviderRegistration
});
module.exports = __toCommonJS(provider_exports);

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

// src/app/actions/provider.ts
async function submitProviderRegistration(formData) {
  let supabase;
  try {
    supabase = createAdminClient();
  } catch (configErr) {
    console.error("Supabase admin client config error:", configErr.message);
    return { success: false, error: `Server configuration error: ${configErr.message}. Ensure SUPABASE_SERVICE_ROLE_KEY is set in environment.` };
  }
  const licenseFile = formData.get("licenseFile");
  const idProofFile = formData.get("idProofFile");
  const chequeFile = formData.get("chequeFile");
  const dataString = formData.get("data");
  if (!dataString) return { success: false, error: "Form data missing" };
  const data = JSON.parse(dataString);
  const documentUrls = {};
  const uploadFile = async (file, prefix) => {
    if (!file || file.size === 0) return null;
    const ext = file.name.split(".").pop() || "pdf";
    const filename = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const { data: uploadData, error } = await supabase.storage.from("documents").upload(`providers/${filename}`, buffer, {
      contentType: file.type || "application/pdf",
      cacheControl: "3600",
      upsert: false
    });
    if (error) {
      console.error(`Error uploading ${prefix}:`, JSON.stringify(error));
      throw new Error(`Failed to upload ${prefix}: ${error.message}`);
    }
    return `providers/${filename}`;
  };
  try {
    if (licenseFile) {
      documentUrls.license = await uploadFile(licenseFile, "license");
    }
    if (idProofFile) {
      documentUrls.id_proof = await uploadFile(idProofFile, "id_proof");
    }
    if (chequeFile) {
      documentUrls.cheque = await uploadFile(chequeFile, "cheque");
    }
    const bankDetails = {
      account_holder_name: data.account_holder_name || "",
      bank_name: data.bank_name || "",
      account_no: data.account_no || "",
      ifsc_code: data.ifsc_code || ""
    };
    const typeMapping = {
      "Hospital": "HOS",
      "Clinic": "CLI",
      "Individual Doctor": "DOC",
      "Pharmacy": "PHY",
      "Diagnostic Center": "DIA",
      "Other": "OTH"
    };
    const typeCode = typeMapping[data.provider_type] || "OTH";
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    const { data: insertData, error: insertError } = await supabase.from("providers").insert({
      provider_type: data.provider_type,
      provider_name: data.provider_name,
      registration_number: data.registration_number,
      gst_number: data.gst_number || null,
      address: data.address,
      state_code: data.state_code,
      city_id: null,
      pin_code: data.pin_code,
      contact_name: data.contact_name,
      designation: data.designation,
      mobile: data.mobile,
      email: data.email,
      bank_details: bankDetails,
      documents: documentUrls,
      type_code: typeCode,
      year,
      status: "pending",
      onboarding_stage: "SUBMITTED",
      agreement_status: "PENDING",
      activation_status: "BLOCKED_UNTIL_SIGNED"
    }).select().single();
    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error(insertError.message);
    }
    return { success: true, provider: insertData };
  } catch (error) {
    console.error("Registration failed:", error);
    return { success: false, error: error.message || "Registration failed" };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  submitProviderRegistration
});
