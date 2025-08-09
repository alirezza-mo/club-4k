/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['bucket-club.storage.c2.liara.space'],
  },
  env : {
      GET_LIARA : process.env.GET_LIARA 
  }
} ;

export default nextConfig;
