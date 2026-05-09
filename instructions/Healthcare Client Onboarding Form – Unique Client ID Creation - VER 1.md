__FORM DESIGN BRIEF__

__Healthcare Client Onboarding Form – Unique Client ID Creation__

__PURPOSE__

This form is used to onboard healthcare providers \(Hospitals, Clinics, Individual Doctors, Pharmacies, Diagnostic Centers\) into a diagnostic aggregator platform\.

Upon successful verification, a Unique Client ID will be generated for:

- Patient registration
- Diagnostic test booking
- Report tracking
- Service access and operations

__GENERAL INSTRUCTIONS FOR DESIGNER__

- Mark mandatory fields with \(\*\)
- Enable file upload feature
- Apply response validation for numeric fields as specified
- Ensure mobile\-friendly, clean and minimal UI
- Enable email collection
- Use section\-wise layout for better readability

__SECTION 1: HEALTHCARE PROVIDER TYPE__

Field Type: Dropdown  
Question: Healthcare Provider Type \*

Options:

- Hospital
- Clinic
- Individual Doctor
- Pharmacy
- Diagnostic Center
- Other

__SECTION 2: PROVIDER DETAILS__

__Name of Healthcare Provider \*__

Field Type: Short Answer \(Text\)

__Registration / License Number \*__

Field Type: Short Answer \(Alphanumeric\)

Validation:

- Minimum 5 characters
- Letters and numbers allowed

__GST Number \(Optional\)__

Field Type: Short Answer  
Validation \(optional\):

- 15\-character GST format validation if enabled

__SECTION 3: ADDRESS DETAILS__

__Registered Address \*__

Field Type: Paragraph Text

__City \*__

Field Type: Short Answer

__State \*__

Field Type: Short Answer or Dropdown \(preferred\)

__PIN Code \*__

Field Type: Short Answer \(Numeric Validation\)

Validation:

- Exactly 6 digits
- Numbers only
- No alphabets or symbols

__SECTION 4: CONTACT PERSON__

__Full Name \*__

Field Type: Short Answer

__Designation \*__

Field Type: Short Answer or Dropdown

__Mobile Number \*__

Field Type: Short Answer \(Numeric Validation\)

Validation:

- Exactly 10 digits
- Must start with 6, 7, 8, or 9
- Numbers only

__Email Address \*__

Field Type: Short Answer

Validation:

- Standard email format validation enabled

__SECTION 5: VERIFICATION DOCUMENTS__

__Registration / License Certificate \*__

Field Type: File Upload

Allowed formats:

- PDF, JPG, PNG  
Max size: 10 MB

__Authorized Person ID Proof \*__

Field Type: File Upload

Allowed formats:

- PDF, JPG, PNG  
Max size: 10 MB

__SECTION 6: BANK DETAILS \(FOR PAYMENTS / SETTLEMENTS\)__

Used only for verified service\-related payments or settlements\.

__Account Holder Name__

Field Type: Short Answer

__Bank Name__

Field Type: Short Answer

__Account Number__

Field Type: Short Answer \(Numeric Validation\)

Validation:

- 9 to 18 digits only
- Numbers only

__IFSC Code__

Field Type: Short Answer \(Alphanumeric Validation\)

Validation:

- Format: 4 letters \+ 0 \+ 6 characters
- Example: HDFC0001234
- Uppercase preferred

__Cancelled Cheque Upload__

Field Type: File Upload  
Allowed formats:

- PDF, JPG, PNG

__SECTION 7: DECLARATION & CONSENT__

Checkbox \(Required\):

- I confirm that all information provided is true, accurate, and valid\.
- I understand that document verification is required for activation of Unique Client ID\.
- I agree to use the platform only for authorized healthcare and diagnostic services\.

__Authorized Signatory Name \*__

Field Type: Short Answer

__Date \*__

Field Type: Date Picker

__SUBMISSION BUTTON__

Text:  
Submit Registration

__CONFIRMATION MESSAGE__

Thank you for your submission\.

Your details have been received and are under verification\. Upon successful approval, your Unique Client ID will be shared via your registered email and mobile number\.

__DESIGN REQUIREMENTS__

- Clean, professional healthcare UI
- Section\-wise structured layout
- Minimal text clutter
- Mobile responsive design
- Clear hierarchy and spacing
- No unnecessary visual elements

__VALIDATION SUMMARY__

__Field__

__Validation Rule__

PIN Code

Exactly 6 digits, numeric only

Mobile Number

10 digits, starts with 6–9

Account Number

9–18 digits, numeric only

IFSC Code

11\-character alphanumeric format

Email

Standard email validation

File Upload

PDF/JPG/PNG only

