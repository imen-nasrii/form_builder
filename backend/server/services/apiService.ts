import fetch from 'node-fetch';

export interface ApiDataSource {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST';
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  requestBody?: any;
  responseMapping: {
    valueField: string;
    labelField: string;
    dataPath?: string; // JSONPath to data array
  };
  authType?: 'none' | 'bearer' | 'apikey' | 'basic';
  authConfig?: {
    token?: string;
    apiKey?: string;
    username?: string;
    password?: string;
    headerName?: string;
  };
}

export interface ApiResponse {
  success: boolean;
  data?: any[];
  error?: string;
}

class ApiService {
  private dataSources: Map<string, ApiDataSource> = new Map();

  registerDataSource(dataSource: ApiDataSource): void {
    this.dataSources.set(dataSource.id, dataSource);
  }

  getDataSource(id: string): ApiDataSource | undefined {
    return this.dataSources.get(id);
  }

  getAllDataSources(): ApiDataSource[] {
    return Array.from(this.dataSources.values());
  }

  async fetchData(dataSourceId: string, filters?: Record<string, any>): Promise<ApiResponse> {
    const dataSource = this.dataSources.get(dataSourceId);
    if (!dataSource) {
      return { success: false, error: 'Data source not found' };
    }

    try {
      const url = this.buildUrl(dataSource.url, dataSource.queryParams, filters);
      const headers = this.buildHeaders(dataSource);
      const body = this.buildRequestBody(dataSource, filters);

      const response = await fetch(url, {
        method: dataSource.method,
        headers,
        body: dataSource.method === 'POST' ? body : undefined,
      });

      if (!response.ok) {
        return { 
          success: false, 
          error: `API request failed: ${response.status} ${response.statusText}` 
        };
      }

      const responseData = await response.json();
      const processedData = this.processResponse(responseData, dataSource.responseMapping);

      return { success: true, data: processedData };
    } catch (error) {
      console.error('API fetch error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private buildUrl(baseUrl: string, queryParams?: Record<string, string>, filters?: Record<string, any>): string {
    const url = new URL(baseUrl);
    
    // Add configured query parameters
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    // Add filter parameters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private buildHeaders(dataSource: ApiDataSource): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'FormBuilder-Pro/1.0',
      ...dataSource.headers,
    };

    // Add authentication headers
    if (dataSource.authType && dataSource.authConfig) {
      switch (dataSource.authType) {
        case 'bearer':
          if (dataSource.authConfig.token) {
            headers['Authorization'] = `Bearer ${dataSource.authConfig.token}`;
          }
          break;
        case 'apikey':
          if (dataSource.authConfig.apiKey && dataSource.authConfig.headerName) {
            headers[dataSource.authConfig.headerName] = dataSource.authConfig.apiKey;
          }
          break;
        case 'basic':
          if (dataSource.authConfig.username && dataSource.authConfig.password) {
            const credentials = Buffer.from(
              `${dataSource.authConfig.username}:${dataSource.authConfig.password}`
            ).toString('base64');
            headers['Authorization'] = `Basic ${credentials}`;
          }
          break;
      }
    }

    return headers;
  }

  private buildRequestBody(dataSource: ApiDataSource, filters?: Record<string, any>): string | undefined {
    if (dataSource.method !== 'POST') return undefined;

    const body = { ...dataSource.requestBody };
    
    // Merge filters into request body if applicable
    if (filters) {
      Object.assign(body, filters);
    }

    return JSON.stringify(body);
  }

  private processResponse(responseData: any, mapping: ApiDataSource['responseMapping']): any[] {
    try {
      let data = responseData;

      // Navigate to data array using dataPath
      if (mapping.dataPath) {
        const pathParts = mapping.dataPath.split('.');
        for (const part of pathParts) {
          if (data && typeof data === 'object') {
            data = data[part];
          }
        }
      }

      // Ensure data is an array
      if (!Array.isArray(data)) {
        console.warn('API response data is not an array:', data);
        return [];
      }

      // Map to standardized format
      return data.map((item: any) => ({
        value: this.extractValue(item, mapping.valueField),
        label: this.extractValue(item, mapping.labelField),
        raw: item, // Keep original data for advanced use cases
      }));
    } catch (error) {
      console.error('Error processing API response:', error);
      return [];
    }
  }

  private extractValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && typeof current === 'object' ? current[key] : undefined;
    }, obj);
  }

  // Predefined data sources for common APIs
  initializeDefaultDataSources(): void {
    // JSON Placeholder for testing
    this.registerDataSource({
      id: 'jsonplaceholder-users',
      name: 'JSONPlaceholder Users',
      url: 'https://jsonplaceholder.typicode.com/users',
      method: 'GET',
      responseMapping: {
        valueField: 'id',
        labelField: 'name',
      },
    });

    this.registerDataSource({
      id: 'jsonplaceholder-posts',
      name: 'JSONPlaceholder Posts',
      url: 'https://jsonplaceholder.typicode.com/posts',
      method: 'GET',
      responseMapping: {
        valueField: 'id',
        labelField: 'title',
      },
    });

    // REST Countries API
    this.registerDataSource({
      id: 'rest-countries',
      name: 'World Countries',
      url: 'https://restcountries.com/v3.1/all',
      method: 'GET',
      queryParams: {
        fields: 'name,cca2,cca3',
      },
      responseMapping: {
        valueField: 'cca2',
        labelField: 'name.common',
      },
    });
  }
}

export const apiService = new ApiService();
apiService.initializeDefaultDataSources();