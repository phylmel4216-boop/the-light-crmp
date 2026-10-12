import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ========================================
// SUPABASE CONFIGURATION
// ========================================

const SUPABASE_URL = "https://mepfggtjvuenkhtknojz.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
"sb_publishable_xmt_xMOhEGhmq6Yw9oBnsg_1wujHnVq";

const supabase = createClient(
SUPABASE_URL,
SUPABASE_PUBLISHABLE_KEY
);

// ========================================
// TYPES FOR JAVASCRIPT EDITORS
// ========================================

/**

* @typedef {Record<string, any>} DatabaseRecord
  */

// ========================================
// HTML ELEMENTS
// ========================================

const welcome = document.getElementById("managerWelcome");
const logoutButton = document.getElementById("logoutButton");
const managementForm = document.getElementById("managementForm");
const recordTitle = document.getElementById("recordTitle");
const recordDescription = document.getElementById("recordDescription");
const recordContent = document.getElementById("recordContent");
const recordURL = document.getElementById("recordURL");
const settingKey = document.getElementById("settingKey");

const descriptionField = document.getElementById("descriptionField");
const contentField = document.getElementById("contentField");
const urlField = document.getElementById("urlField");
const settingKeyField = document.getElementById("settingKeyField");

const saveRecordButton = document.getElementById("saveRecordButton");
const clearFormButton = document.getElementById("clearFormButton");
const managementMessage = document.getElementById("managementMessage");
const managementRecords = document.getElementById("managementRecords");
const sectionTitle = document.getElementById("sectionTitle");
const recordsTitle = document.getElementById("recordsTitle");

const menuButtons = document.querySelectorAll("[data-section]");

// ========================================
// CHECK REQUIRED HTML ELEMENTS
// ========================================

const requiredElements = [
welcome,
logoutButton,
managementForm,
recordTitle,
recordDescription,
recordContent,
recordURL,
settingKey,
descriptionField,
contentField,
urlField,
settingKeyField,
saveRecordButton,
clearFormButton,
managementMessage,
managementRecords,
sectionTitle,
recordsTitle
];

if (requiredElements.some(function (element) {
return element === null;
})) {
console.error(
"Dashboard setup error: one or more required HTML elements are missing."
);
}

// ========================================
// DATABASE SECTION CONFIGURATION
// ========================================

const sections = {
factions: {
title: "Factions",
table: "factions",
listTitle: "Existing Factions",
fields: ["name", "description"]
},

jobs: {
    title: "Jobs",
    table: "jobs",
    listTitle: "Existing Jobs",
    fields: ["name", "description"]
},

server_rules: {
    title: "Server Rules",
    table: "server_rules",
    listTitle: "Existing Rules",
    fields: ["title", "content"]
},

announcements: {
    title: "News & Announcements",
    table: "announcements",
    listTitle: "Existing Announcements",
    fields: ["title", "content"]
},

downloads: {
    title: "Downloads",
    table: "downloads",
    listTitle: "Existing Downloads",
    fields: ["title", "url", "description"]
},

site_settings: {
    title: "Website Settings",
    table: "site_settings",
    listTitle: "Current Settings",
    fields: ["setting_key", "setting_value"]
}

};

let currentSection = "factions";
let editingRecordId = null;
let managerIsVerified = false;

// ========================================
// SAFE HTML ELEMENT CREATION
// ========================================

/**

* Creates an HTML element and adds safe text to it.

* @param {HTMLElement} parent

* @param {string} tag

* @param {unknown} value

* @returns {HTMLElement}
  */
  function addTextElement(parent, tag, value) {
  const element = document.createElement(tag);
  
  element.textContent = value == null ? "" : String(value);
  
  parent.appendChild(element);
  
  return element;
  }

// ========================================
// DISPLAY MESSAGES
// ========================================

/**

* @param {string} message
  */
  function showMessage(message) {
  managementMessage.textContent = message;
  }

// ========================================
// VERIFY MANAGEMENT ACCOUNT
// ========================================

async function verifyManager() {
const authResult = await supabase.auth.getUser();

if (authResult.error || !authResult.data.user) {
    window.location.replace("./management.html");
    return false;
}

const user = authResult.data.user;

const profileResult = await supabase
    .from("profiles")
    .select("username, role")
    .eq("id", user.id)
    .single();

if (
    profileResult.error ||
    !profileResult.data ||
    profileResult.data.role !== "manager"
) {
    await supabase.auth.signOut();

    window.location.replace("./management.html");

    return false;
}

welcome.textContent =
    "Welcome, " +
    profileResult.data.username +
    " | Management access confirmed";

managerIsVerified = true;

return true;

}

// ========================================
// SWITCH MANAGEMENT SECTION
// ========================================

/**

* @param {string} sectionName
  */
  function selectSection(sectionName) {
  if (!Object.prototype.hasOwnProperty.call(sections, sectionName)) {
  return;
  }
  
  currentSection = sectionName;
  editingRecordId = null;
  
  menuButtons.forEach(function (button) {
  button.classList.toggle(
  "active",
  button.dataset.section === sectionName
  );
  });
  
  const config = sections[sectionName];
  
  sectionTitle.textContent = "Manage " + config.title;
  recordsTitle.textContent = config.listTitle;
  
  descriptionField.hidden = true;
  contentField.hidden = true;
  urlField.hidden = true;
  settingKeyField.hidden = true;
  
  managementForm.reset();
  
  if (config.fields.includes("description")) {
  descriptionField.hidden = false;
  }
  
  if (config.fields.includes("content")) {
  contentField.hidden = false;
  }
  
  if (config.fields.includes("url")) {
  urlField.hidden = false;
  descriptionField.hidden = false;
  }
  
  if (config.fields.includes("setting_key")) {
  settingKeyField.hidden = false;
  recordTitle.placeholder = "Enter setting value";
  } else {
  recordTitle.placeholder = "Enter name or title";
  }
  
  const titleLabel = recordTitle.previousElementSibling;
  
  if (titleLabel) {
  titleLabel.textContent =
  sectionName === "site_settings"
  ? "Setting Value"
  : "Name / Title";
  }
  
  saveRecordButton.textContent = "SAVE";
  saveRecordButton.disabled = false;
  
  showMessage("");
  
  loadRecords();
  }

// ========================================
// LOAD DATABASE RECORDS
// ========================================

async function loadRecords() {
if (!managerIsVerified) {
return;
}

managementRecords.replaceChildren();

addTextElement(
    managementRecords,
    "p",
    "Loading records..."
);

const config = sections[currentSection];

try {
    const result = await supabase
        .from(config.table)
        .select("*")
        .order("id", { ascending: false });

    if (result.error) {
        console.error("Load error:", result.error);

        managementRecords.replaceChildren();

        addTextElement(
            managementRecords,
            "p",
            "Could not load records: " + result.error.message
        );

        return;
    }

    managementRecords.replaceChildren();

    /** @type {DatabaseRecord[]} */
    const records = result.data || [];

    if (records.length === 0) {
        const emptyMessage = addTextElement(
            managementRecords,
            "p",
            "No records yet. Use the form above to add one."
        );

        emptyMessage.className = "management-empty";

        return;
    }

    records.forEach(
        /**
         * @param {DatabaseRecord} record
         */
        function (record) {
            const card = document.createElement("article");

            card.className = "management-record";

            const heading =
                currentSection === "site_settings"
                    ? record.setting_key
                    : record.name || record.title;

            addTextElement(
                card,
                "h3",
                heading || "Untitled"
            );

            if (currentSection === "site_settings") {
                addTextElement(
                    card,
                    "p",
                    "Value: " + (record.setting_value || "")
                );
            } else {
                if (record.description) {
                    addTextElement(
                        card,
                        "p",
                        record.description
                    );
                }

                if (record.content) {
                    addTextElement(
                        card,
                        "p",
                        record.content
                    );
                }

                if (record.url) {
                    addTextElement(
                        card,
                        "p",
                        "Download: " + record.url
                    );
                }
            }

            const actions = document.createElement("div");

            actions.className = "management-record-actions";

            const editButton = document.createElement("button");

            editButton.type = "button";
            editButton.className = "management-edit";
            editButton.textContent = "EDIT";

            editButton.addEventListener("click", function () {
                editRecord(record);
            });

            const deleteButton = document.createElement("button");

            deleteButton.type = "button";
            deleteButton.className = "management-delete";
            deleteButton.textContent = "DELETE";

            deleteButton.addEventListener("click", function () {
                deleteRecord(record.id);
            });

            actions.appendChild(editButton);
            actions.appendChild(deleteButton);

            card.appendChild(actions);

            managementRecords.appendChild(card);
        }
    );
} catch (error) {
    console.error("Unexpected load error:", error);

    managementRecords.replaceChildren();

    addTextElement(
        managementRecords,
        "p",
        "An unexpected error occurred while loading records."
    );
}

}

// ========================================
// EDIT EXISTING RECORD
// ========================================

/**

* @param {DatabaseRecord} record
  */
  function editRecord(record) {
  editingRecordId = record.id;
  
  if (currentSection === "site_settings") {
  settingKey.value = record.setting_key || "";
  recordTitle.value = record.setting_value || "";
  } else {
  recordTitle.value = record.name || record.title || "";
  recordDescription.value = record.description || "";
  recordContent.value = record.content || "";
  recordURL.value = record.url || "";
  }
  
  saveRecordButton.textContent = "UPDATE RECORD";
  
  showMessage("Editing record. Save to apply your changes.");
  
  managementForm.scrollIntoView({
  behavior: "smooth",
  block: "start"
  });
  }

// ========================================
// ADD OR UPDATE RECORD
// ========================================

managementForm.addEventListener("submit", async function (event) {
event.preventDefault();

if (!managerIsVerified) {
    showMessage("Management access has not been verified.");
    return;
}

const config = sections[currentSection];

/** @type {DatabaseRecord} */
const payload = {};

if (currentSection === "site_settings") {
    const key = settingKey.value.trim();
    const value = recordTitle.value.trim();

    if (!key || !value) {
        showMessage("Enter both a setting key and value.");
        return;
    }

    payload.setting_key = key;
    payload.setting_value = value;
    payload.updated_at = new Date().toISOString();
} else {
    const title = recordTitle.value.trim();

    if (!title) {
        showMessage("Please enter a name or title.");
        return;
    }

    if (config.fields.includes("name")) {
        payload.name = title;
    }

    if (config.fields.includes("title")) {
        payload.title = title;
    }

    if (config.fields.includes("description")) {
        payload.description = recordDescription.value.trim();
    }

    if (config.fields.includes("content")) {
        const content = recordContent.value.trim();

        if (!content) {
            showMessage("Please enter the content.");
            return;
        }

        payload.content = content;
    }

    if (config.fields.includes("url")) {
        const url = recordURL.value.trim();

        if (!url) {
            showMessage("Please enter a download URL.");
            return;
        }

        try {
            const parsedURL = new URL(url);

            if (
                parsedURL.protocol !== "https:" &&
                parsedURL.protocol !== "http:"
            ) {
                showMessage(
                    "Use a valid HTTP or HTTPS download link."
                );

                return;
            }
        } catch {
            showMessage("Enter a valid download URL.");
            return;
        }

        payload.url = url;
    }
}

saveRecordButton.disabled = true;
showMessage("Saving...");

try {
    let result;

    if (editingRecordId !== null) {
        result = await supabase
            .from(config.table)
            .update(payload)
            .eq("id", editingRecordId);
    } else {
        result = await supabase
            .from(config.table)
            .insert(payload);
    }

    if (result.error) {
        console.error("Save error:", result.error);

        showMessage("Save failed: " + result.error.message);

        return;
    }

    const wasEditing = editingRecordId !== null;

    editingRecordId = null;

    managementForm.reset();

    saveRecordButton.textContent = "SAVE";

    showMessage(
        wasEditing
            ? "Record updated successfully!"
            : "Record added successfully!"
    );

    await loadRecords();
} catch (error) {
    console.error("Unexpected save error:", error);

    showMessage("Something went wrong while saving.");
} finally {
    saveRecordButton.disabled = false;
}

});

// ========================================
// DELETE RECORD
// ========================================

/**

* @param {number} recordId
  */
  async function deleteRecord(recordId) {
  if (!managerIsVerified) {
  return;
  }
  
  const confirmed = window.confirm(
  "Are you sure you want to delete this record?"
  );
  
  if (!confirmed) {
  return;
  }
  
  const config = sections[currentSection];
  
  showMessage("Deleting...");
  
  try {
  const result = await supabase
  .from(config.table)
  .delete()
  .eq("id", recordId);
  
   if (result.error) {
     console.error("Delete error:", result.error);

     showMessage("Delete failed: " + result.error.message);

     return;
 }

 editingRecordId = null;

 showMessage("Record deleted successfully.");

 await loadRecords();
  
  } catch (error) {
  console.error("Unexpected delete error:", error);
  
   showMessage("Something went wrong while deleting.");
  
  }
  }

// ========================================
// CLEAR FORM
// ========================================

clearFormButton.addEventListener("click", function () {
editingRecordId = null;

managementForm.reset();

saveRecordButton.textContent = "SAVE";
saveRecordButton.disabled = false;

showMessage("");

});

// ========================================
// NAVIGATION MENU
// ========================================

menuButtons.forEach(function (button) {
button.addEventListener("click", function () {
const sectionName = button.dataset.section;

    if (sectionName) {
        selectSection(sectionName);
    }
});

});

// ========================================
// LOGOUT
// ========================================

logoutButton.addEventListener("click", async function () {
logoutButton.disabled = true;
logoutButton.textContent = "LOGGING OUT...";

try {
    const result = await supabase.auth.signOut();

    if (result.error) {
        console.error("Logout error:", result.error);

        showMessage("Logout failed. Please try again.");

        logoutButton.disabled = false;
        logoutButton.textContent = "LOGOUT";

        return;
    }

    window.location.replace("./management.html");
} catch (error) {
    console.error("Unexpected logout error:", error);

    showMessage("Logout failed. Please try again.");

    logoutButton.disabled = false;
    logoutButton.textContent = "LOGOUT";
}

});

// ========================================
// START DASHBOARD
// ========================================

async function startDashboard() {
try {
const verified = await verifyManager();

    if (!verified) {
        return;
    }

    selectSection("factions");
} catch (error) {
    console.error("Dashboard startup error:", error);

    if (welcome) {
        welcome.textContent =
            "Could not verify your management account.";
    }
}

}

startDashboard();