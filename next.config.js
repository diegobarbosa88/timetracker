/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para despliegue dinámico en lugar de exportación estática
  // output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: true,
};
module.exports = nextConfig;
