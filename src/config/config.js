const Config = {
  baseUrl: 'http://localhost:8000',
  apiVersion: 'v1',

  // تابعی برای ساخت URL کامل با توجه به نسخه API و endpoint
  getApiUrl: (segment, endpoint, params = {}) => {
    const url = `${Config.baseUrl}/${segment}/${Config.apiVersion}/${endpoint}`;

    // افزودن پارامترها به URL
    const queryString = new URLSearchParams(params).toString();
    return queryString ? `${url}?${queryString}` : url;
  }
};

export default Config;
