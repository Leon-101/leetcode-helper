module.exports = {
      manifest_version: 3,
      name: "力扣刷题助手",
      description: "",
      version: "1.0.0",
      // default_locale: "zh",
      // icons: {},
      author: "Leon_101@foxmail.com",
      background: {
            service_worker: "background/background.js",
            type: "module",
      },
      action: {
            default_title: "",
            default_popup: "popup/popup.html",
      },
      content_scripts: [
            {
                  matches: [
                        "https://leetcode.cn/*",
                  ],
                  js: ["content_scripts/main.js"],
                  run_at: "document_start",
                  // all_frames: true,
                  // match_about_blank: true,
                  // match_origin_as_fallback: true,
            },
      ],
      options_ui: {
            page: "options/options.html",
      },
      "web_accessible_resources": [{
            "resources": ["web_accessible_resources/*"],
            "matches": ["https://leetcode.cn/*"]
      }],
      "host_permissions": [
            "<all_urls>",
      ],
      permissions: [
            "storage",
      ]
}
