export const getURL = () => {
    let url =
        import.meta.env.PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
        "http://localhost:5173/";
    url = url.includes("http") ? url : `https://${url}`;
    url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
    return url;
};
