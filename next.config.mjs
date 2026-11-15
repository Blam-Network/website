/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@blamnetwork/blf"],
    async redirects() {
        return [
            { source: "/player/:path*", destination: "/halo3/player/:path*", permanent: true },
            { source: "/profile", destination: "/halo3/profile", permanent: true },
            { source: "/halo3/games", destination: "/games", permanent: true },
            { source: "/haloreach/games", destination: "/games?game=reach", permanent: true },
            { source: "/halo3/files", destination: "/files", permanent: true },
            { source: "/halo3/screenshots", destination: "/screenshots", permanent: true },
        ];
    },
};

export default nextConfig;
