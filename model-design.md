# Model Design of the Freelance CRM

Client \
  -> First Name (String, min 2, required) \
  -> Last Name (String, min 2, required) \
  -> IsCodementor (Boolean, required) \
  -> Email (Email, required if NOT from codementor) \
  -> WhatsApp number (Phone, required if NOT from codementor) \
  -> Level (String, single select, required) {beginner|intermidiate|advanced} \
  -> ServiceType (String[], multi select, required) {coaching|development} \
  -> Rate (Integer, min 20, required) {USD/hour}
  -> Tags: (String[], multi select, required) {JavaScript|HTML|CSS|Vue.js|Front-End|Back-end|Node.js|Express.js|MongoDB|Mongoose}
  -> Projects (refs[])

Project \
  -> Title (String, min 5, required) \
  -> Techs (String[], multi select, required) {JavaScript|HTML|CSS|Vue.js|Front-End|Back-end|Node.js|Express.js|MongoDB|Mongoose} \
  -> Requirements (String, required) \
  -> Milestones (String[], multi select, required) \
  -> PaymentMethod (String, single select, required) {codementor|bank|paypal} \
  -> Budget (Integer, min 100, required) {USD} \
  -> HasDownPayment (Boolean, required) \
  -> WasPaymentDone (Boolean, required if HasDownPayment = true) \
  -> IsCompleted (Boolean, default = false) \
  -> IsInvoiceSent (Boolean, default = false) \
  -> WasPaidInFull (Boolean, default = false) \
  -> Client (ref: "Client")