/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  // async rewrites() {
  //   return [
  //     {
  //       source: '/login',
  //       destination: 'http://localhost:8000/login',
  //     },
  //     {
  //       source: '/register',
  //       destination: 'http://localhost:8000/register',
  //     },
  //   ];
  // },
};

export default nextConfig;
