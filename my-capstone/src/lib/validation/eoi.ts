import { z } from "zod";

/** FormData sends "" for empty fields; treat that as undefined. */
const optionalText = (max: number) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().max(max).optional(),
  );

export const studentEoiSchema = z.object({
  projectId: z.string().min(1, "Missing project."),
  message: z
    .string()
    .trim()
    .min(50, "Tell us a bit more (at least 50 characters).")
    .max(2000, "Keep it under 2000 characters."),
});

export const reviewEoiSchema = z.object({
  eoiId: z.string().min(1),
  decision: z.enum(["APPROVE", "REJECT"]),
  projectId: optionalText(100), // required only when approving a mentor/sponsor
  reviewNote: optionalText(1000),
});

export const partnerEoiSchema = z.object({
  type: z.enum(["MENTOR", "SPONSOR"]),
  organisation: optionalText(200),
  message: z
    .string()
    .trim()
    .min(20, "Tell us a bit more (at least 20 characters).")
    .max(2000, "Keep it under 2000 characters."),
});