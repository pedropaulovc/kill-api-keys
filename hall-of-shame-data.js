/* Auth method metadata — label + whether it's a "good" (non-shared-secret) method */
const authMethodMeta = {
  apiKeys:          { label: "API Keys",          good: false },
  oauth2:           { label: "OAuth 2.0",         good: true  },
  oidc:             { label: "OIDC",              good: true  },
  mtls:             { label: "mTLS",              good: true  },
  webhookSigning:   { label: "Webhook Signing",   good: true  },
  workloadIdentity: { label: "Workload Identity", good: true  },
  signedJwt:        { label: "Signed JWTs",       good: true  },
};

/*
 * Service directory.
 *
 * Shame level is computed automatically:
 *   red    — apiKeys: true and NO good method is true
 *   yellow — apiKeys: true AND at least one good method is true
 *   green  — apiKeys: false
 *
 * To add a service, append an entry and send a PR (or open an issue).
 */
const services = [
  /* ── AI / ML ───────────────────────────────────────────── */
  {
    name: "OpenAI",
    category: "AI / ML",
    authMethods: {
      apiKeys: true,
      oauth2: false,
      oidc: false,
      mtls: false,
      webhookSigning: false,
      workloadIdentity: false,
      signedJwt: false,
    },
    notes: "API key is the only authentication option for the API.",
    docsUrl: "https://platform.openai.com/docs/api-reference/authentication",
  },
  {
    name: "Anthropic",
    category: "AI / ML",
    authMethods: {
      apiKeys: true,
      oauth2: false,
      oidc: false,
      mtls: false,
      webhookSigning: false,
      workloadIdentity: false,
      signedJwt: false,
    },
    notes: "API key is the only authentication option. Available via cloud partners (AWS Bedrock, GCP Vertex) which support workload identity.",
    docsUrl: "https://docs.anthropic.com/en/api/getting-started",
  },
  {
    name: "Cohere",
    category: "AI / ML",
    authMethods: {
      apiKeys: true,
      oauth2: false,
      oidc: false,
      mtls: false,
      webhookSigning: false,
      workloadIdentity: false,
      signedJwt: false,
    },
    notes: "API key only. Also available on AWS Bedrock and Azure.",
    docsUrl: "https://docs.cohere.com/reference/about",
  },
  {
    name: "Replicate",
    category: "AI / ML",
    authMethods: {
      apiKeys: true,
      oauth2: false,
      oidc: false,
      mtls: false,
      webhookSigning: true,
      workloadIdentity: false,
      signedJwt: false,
    },
    notes: "API key for requests; webhook signatures for prediction callbacks.",
    docsUrl: "https://replicate.com/docs/reference/http",
  },

  /* ── Payments ──────────────────────────────────────────── */
  {
    name: "Stripe",
    category: "Payments",
    authMethods: {
      apiKeys: true,
      oauth2: true,
      oidc: false,
      mtls: false,
      webhookSigning: true,
      workloadIdentity: false,
      signedJwt: false,
    },
    notes: "OAuth available for Connect platforms; standard API uses secret keys. Webhook signatures supported.",
    docsUrl: "https://docs.stripe.com/keys",
  },
  {
    name: "PayPal",
    category: "Payments",
    authMethods: {
      apiKeys: false,
      oauth2: true,
      oidc: false,
      mtls: false,
      webhookSigning: true,
      workloadIdentity: false,
      signedJwt: false,
    },
    notes: "Uses OAuth 2.0 Client Credentials for API access. Webhook signatures for event verification.",
    docsUrl: "https://developer.paypal.com/api/rest/authentication/",
  },
  {
    name: "Square",
    category: "Payments",
    authMethods: {
      apiKeys: true,
      oauth2: true,
      oidc: false,
      mtls: false,
      webhookSigning: true,
      workloadIdentity: false,
      signedJwt: false,
    },
    notes: "OAuth for third-party apps; personal access tokens (API keys) for first-party use.",
    docsUrl: "https://developer.squareup.com/docs/oauth-api/overview",
  },

  /* ── Communication ─────────────────────────────────────── */
  {
    name: "Twilio",
    category: "Communication",
    authMethods: {
      apiKeys: true,
      oauth2: false,
      oidc: false,
      mtls: false,
      webhookSigning: true,
      workloadIdentity: false,
      signedJwt: false,
    },
    notes: "Account SID + Auth Token (shared secret). Supports request signing for webhook validation.",
    docsUrl: "https://www.twilio.com/docs/iam/api-keys",
  },
  {
    name: "SendGrid",
    category: "Communication",
    authMethods: {
      apiKeys: true,
      oauth2: false,
      oidc: false,
      mtls: false,
      webhookSigning: true,
      workloadIdentity: false,
      signedJwt: false,
    },
    notes: "API key only for sending. Webhook signing available for event webhooks.",
    docsUrl: "https://docs.sendgrid.com/for-developers/sending-email/authentication",
  },
  {
    name: "Mailgun",
    category: "Communication",
    authMethods: {
      apiKeys: true,
      oauth2: false,
      oidc: false,
      mtls: false,
      webhookSigning: true,
      workloadIdentity: false,
      signedJwt: false,
    },
    notes: "API key for sending. Webhook signatures for event notification verification.",
    docsUrl: "https://documentation.mailgun.com/docs/mailgun/api-reference/openapi-final/tag/Authentication/",
  },

  /* ── Cloud Providers ───────────────────────────────────── */
  {
    name: "AWS",
    category: "Cloud",
    authMethods: {
      apiKeys: true,
      oauth2: false,
      oidc: true,
      mtls: false,
      webhookSigning: false,
      workloadIdentity: true,
      signedJwt: false,
    },
    notes: "IAM roles and instance profiles preferred. Access keys exist but AWS actively discourages them. OIDC federation supported for external workloads.",
    docsUrl: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html",
  },
  {
    name: "Google Cloud",
    category: "Cloud",
    authMethods: {
      apiKeys: true,
      oauth2: true,
      oidc: true,
      mtls: false,
      webhookSigning: false,
      workloadIdentity: true,
      signedJwt: true,
    },
    notes: "Service account keys exist but GCP recommends workload identity federation. API keys available only for public API calls.",
    docsUrl: "https://cloud.google.com/docs/authentication",
  },
  {
    name: "Azure",
    category: "Cloud",
    authMethods: {
      apiKeys: true,
      oauth2: true,
      oidc: true,
      mtls: true,
      webhookSigning: false,
      workloadIdentity: true,
      signedJwt: true,
    },
    notes: "Managed identities and Entra ID preferred. Connection strings (shared keys) exist for some services but are being deprecated.",
    docsUrl: "https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview",
  },

  /* ── Developer Tools ───────────────────────────────────── */
  {
    name: "GitHub",
    category: "Dev Tools",
    authMethods: {
      apiKeys: true,
      oauth2: true,
      oidc: true,
      mtls: false,
      webhookSigning: true,
      workloadIdentity: false,
      signedJwt: true,
    },
    notes: "Personal access tokens (classic and fine-grained), GitHub Apps with JWTs, OAuth Apps, and OIDC for Actions. Webhook secrets for verification.",
    docsUrl: "https://docs.github.com/en/rest/authentication",
  },
  {
    name: "GitLab",
    category: "Dev Tools",
    authMethods: {
      apiKeys: true,
      oauth2: true,
      oidc: true,
      mtls: false,
      webhookSigning: true,
      workloadIdentity: false,
      signedJwt: false,
    },
    notes: "Personal/project/group access tokens, plus OAuth 2.0 and OIDC for CI/CD. Webhook token verification supported.",
    docsUrl: "https://docs.gitlab.com/ee/api/rest/authentication.html",
  },
  {
    name: "Datadog",
    category: "Dev Tools",
    authMethods: {
      apiKeys: true,
      oauth2: true,
      oidc: false,
      mtls: false,
      webhookSigning: false,
      workloadIdentity: false,
      signedJwt: false,
    },
    notes: "API + application key pair for direct access. OAuth available for Datadog Apps (integrations).",
    docsUrl: "https://docs.datadoghq.com/account_management/api-app-keys/",
  },
  {
    name: "PagerDuty",
    category: "Dev Tools",
    authMethods: {
      apiKeys: true,
      oauth2: true,
      oidc: false,
      mtls: false,
      webhookSigning: true,
      workloadIdentity: false,
      signedJwt: false,
    },
    notes: "API token or OAuth 2.0 for third-party apps. Webhook signatures for v3 webhooks.",
    docsUrl: "https://developer.pagerduty.com/docs/authentication",
  },

  /* ── Infrastructure ────────────────────────────────────── */
  {
    name: "Cloudflare",
    category: "Infrastructure",
    authMethods: {
      apiKeys: true,
      oauth2: true,
      oidc: false,
      mtls: false,
      webhookSigning: false,
      workloadIdentity: false,
      signedJwt: false,
    },
    notes: "Global API key (legacy) and API tokens (scoped). OAuth available for partner integrations.",
    docsUrl: "https://developers.cloudflare.com/fundamentals/api/get-started/",
  },
  {
    name: "Vercel",
    category: "Infrastructure",
    authMethods: {
      apiKeys: true,
      oauth2: true,
      oidc: true,
      mtls: false,
      webhookSigning: true,
      workloadIdentity: false,
      signedJwt: false,
    },
    notes: "Access tokens for API. OAuth for integrations. OIDC for deployments. Webhook signatures supported.",
    docsUrl: "https://vercel.com/docs/rest-api#authentication",
  },
  {
    name: "Fastly",
    category: "Infrastructure",
    authMethods: {
      apiKeys: true,
      oauth2: false,
      oidc: false,
      mtls: false,
      webhookSigning: false,
      workloadIdentity: false,
      signedJwt: false,
    },
    notes: "API token is the only authentication method.",
    docsUrl: "https://www.fastly.com/documentation/reference/api/#authentication",
  },

  /* ── Collaboration ─────────────────────────────────────── */
  {
    name: "Slack",
    category: "Collaboration",
    authMethods: {
      apiKeys: true,
      oauth2: true,
      oidc: false,
      mtls: false,
      webhookSigning: true,
      workloadIdentity: false,
      signedJwt: false,
    },
    notes: "Bot tokens and user tokens (bearer). OAuth 2.0 for app installation flow. Request signing for events API.",
    docsUrl: "https://api.slack.com/authentication",
  },
];
