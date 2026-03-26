import fs from "fs/promises";
import path from "path";
import type { Vendor, Certification, Module } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

interface VendorsFile {
  vendors: Vendor[];
}

export async function getVendors(): Promise<Vendor[]> {
  const raw = await fs.readFile(
    path.join(CONTENT_DIR, "vendors.json"),
    "utf-8"
  );
  const data: VendorsFile = JSON.parse(raw);
  return data.vendors;
}

export async function getVendor(slug: string): Promise<Vendor | null> {
  const vendors = await getVendors();
  return vendors.find((v) => v.slug === slug) ?? null;
}

export async function getCertification(
  vendorSlug: string,
  certSlug: string
): Promise<Certification | null> {
  try {
    const raw = await fs.readFile(
      path.join(CONTENT_DIR, "certifications", vendorSlug, `${certSlug}.json`),
      "utf-8"
    );
    return JSON.parse(raw) as Certification;
  } catch {
    return null;
  }
}

export async function getModule(
  vendorSlug: string,
  certSlug: string,
  moduleSlug: string
): Promise<{ module: Module; certification: Certification } | null> {
  const cert = await getCertification(vendorSlug, certSlug);
  if (!cert) return null;
  const mod = cert.modules.find((m) => m.slug === moduleSlug);
  if (!mod) return null;
  return { module: mod, certification: cert };
}

export async function getAllCertifications(
  vendorSlug: string
): Promise<Certification[]> {
  const vendor = await getVendor(vendorSlug);
  if (!vendor) return [];
  const certs: Certification[] = [];
  for (const certSlug of vendor.certifications) {
    const cert = await getCertification(vendorSlug, certSlug);
    if (cert) certs.push(cert);
  }
  return certs;
}
