import { injectScript } from "./injectScript";
injectScript(chrome.runtime.getURL('web_accessible_resources/inject.js'));
