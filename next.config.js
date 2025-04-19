/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cambiando de exportación estática a despliegue dinámico
  // output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: true,
};
module.exports = nextConfig;
