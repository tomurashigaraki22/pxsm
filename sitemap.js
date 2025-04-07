export const BASE_URL = 'https://pxsm.vercel.app';

export const dynamicRoutes = async () => {
  // Fetch dynamic routes from API or database if required
  return ['/', 'dashboard'];
};

export const excludeRoutes = ['/admin', '/private', '/payment-callback'];