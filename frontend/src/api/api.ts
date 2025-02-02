type ApiRules = Record<
  string,
  {
    method: "GET" | "POST" | "PUT" | "DELETE";
    url: string;
  }
>;

class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(baseUrl: string, headers: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  /**
   * Dynamically generate API methods based on rules.
   */
  generateMethods(rules: ApiRules): Record<string, Function> {
    const methods: Record<string, Function> = {};

    Object.entries(rules).forEach(([name, { method, url }]) => {
      methods[name] = async (params?: Record<string, any>, body?: any) => {
        const endpoint = this.interpolateUrl(url, params);
        return this.request(endpoint, method, body);
      };
    });

    return methods;
  }

  /**
   * Helper to interpolate URL with parameters.
   */
  private interpolateUrl(url: string, params?: Record<string, any>): string {
    if (!params) return url;

    return url.replace(/{(\w+)}/g, (_, key) => {
      if (!params[key]) throw new Error(`Missing parameter: ${key}`);
      return encodeURIComponent(params[key]);
    });
  }

  /**
   * Perform the API request.
   */
  private async request(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: any
  ) {
    const url = `${this.baseUrl}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...this.headers,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Error ${response.status}: ${error.message || "Unknown error"}`
      );
    }

    return response.json();
  }
}