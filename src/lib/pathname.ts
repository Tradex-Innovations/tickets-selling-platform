export function normalizePathname(pathname: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH;
  const path = basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`))
    ? pathname.slice(basePath.length)
    : pathname;
  return path.replace(/\/+$/, "") || "/";
}
